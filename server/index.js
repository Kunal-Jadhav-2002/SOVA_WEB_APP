const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');
require('dotenv').config();
const firebaseAdmin = require('firebase-admin');

const { createCanvas, loadImage } = require('canvas');

const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://sova-gloves-default-rtdb.firebaseio.com/"
});

// Initialize Cashfree credentials
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Generate a unique order ID
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12);
}

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Payment initiation route
app.post('/payment', async (req, res) => {
  const { totalContribution, name, phone, address, email, donorTitle } = req.body; // Accept form data

  try {
    const request = {
      order_amount: parseFloat(totalContribution), // Use the provided amount
      order_currency: "INR",
      order_id: await generateOrderId(),
      customer_details: {
        customer_id: `donor_${Date.now()}`, // Generate a unique ID
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        
      },
    };

    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        console.log(response.data);
        const { payment_session_id, order_id } = response.data;

        if (payment_session_id && order_id) {
          res.json({ payment_session_id, order_id });
        } else {
          res.status(500).json({ message: "Failed to create payment session." });
        }
      })
      .catch((error) => {
        console.error(error.response?.data?.message || "Unknown error");
        res.status(500).json({ message: error.response?.data?.message || "Failed to initiate payment" });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error occurred while initiating payment" });
  }
});



app.post("/api/verify", async (req, res) => {
  const { orderId } = req.body;

  try {
    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        const paymentDetails = response.data;

        if (paymentDetails && paymentDetails.payment_status === "SUCCESS") {
          res.json({ payment_status: "SUCCESS" });
        } else {
          res.json({ payment_status: "FAILED" });
        }
      })
      .catch((error) => {
        console.error(error.response?.data?.message || "Unknown error");
        res.status(500).json({ message: error.response?.data?.message || "Failed to fetch payment details." });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred during payment verification." });
  }
});


const generateRandomId = async () => {
  let id;
  do {
      id = Math.floor(1000000 + Math.random() * 9000000).toString(); // Generate a random ID
  } while (await checkIdExists(id)); // Check if the generated ID exists

  return id; // Return the unique ID
};

// Function to check if the ID already exists in the database
const checkIdExists = async (id) => {
  const db = firebaseAdmin.database();
  const idRef = db.ref('users').orderByChild('id').equalTo(id);
  const snapshot = await idRef.once('value');
  return snapshot.exists();
};



app.post('/store-contribution', async (req, res) => {
  

 
    
    const uniqueId = generateRandomId(); 
    try {
      const { name, phone, address, email, donorTitle, totalContribution } = req.body;
  
      if (!name || !phone || !address || !email || !donorTitle || !totalContribution) {
        return res.status(400).json({ message: 'All fields are required!' });
      }
  
      // Save data to Firebase
      const db = firebaseAdmin.database();
      const donationRef = db.ref('users').push();
      await donationRef.set({
        id : uniqueId,
        name,
        phone,
        address,
        email,
        donorTitle,
        totalContribution,
        timestamp: firebaseAdmin.database.ServerValue.TIMESTAMP,
      });
  
      res.status(200).json({ message: 'Donation successfully recorded!' });
    } catch (error) {
      console.error('Error saving donation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});


const validRewards = [
  { title: "Selfless Supporter", amount: 119 },
  { title: "Helping Hands", amount: 299 },
  { title: "Dual Impact", amount: 549 },
  { title: "Caring Companion", amount: 899 },
  { title: "Promising Protector", amount: 1399 },
  { title: "Community Hero", amount: 1899 },
  { title: "Sova Champion", amount: 2399 },
  { title: "Architect of Impact", amount: 4999 }
];


const validateReward = (title, amount) => {
  const reward = validRewards.find(r => r.title === title);
  if (!reward) {
      return { valid: false, message: "Invalid reward title." };
  }

  const ans = amount % reward.amount;
  if (amount <= 0 || ans !== 0) {
      return { valid: false, message: "Invalid reward amount or amount is not a multiple of the reward value." };
  }

  return { valid: true, message: "Valid reward." };
};

// API endpoint to validate rewards
app.post('/validate-reward', (req, res) => {
  const { title, amount } = req.body;
  const result = validateReward(title, amount);

  if (result.valid) {
      res.status(200).json(result);
  } else {
      res.status(400).json(result);
  }
});


app.get('/api/hero-content', (req, res) => {
  const heroContent = {
      heading: "कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती। करमूले तु गोविन्दः प्रभाते करदर्शनम्॥",
      author: "",
      appeal: "The hands of laborers build our world—Hands carry prosperity (Lakshmi), skill (Saraswati), and sustenance (Govinda). Yet, they remain unprotected. Let’s safeguard their hands with Sova Gloves. Their hands create; let's care! 🧤✨",
      heroHeading: "Every hand you support, lifts us all",
      heroInfo: "Your contribution doesn’t end today. Every time someone wears the gloves, they’ll remember the difference you made in their lives and their safety. Together, we can make a difference.",
      images: [
          "images/farmer7.jpeg",
          "images/farmer2.jpg",
          "images/farmer8.jpg",
          "images/FARMER1.jpeg",
          "images/farmer6.jpeg",
          "images/FARMER2.jpeg",
          "images/farmer5.jpeg",
          
          
          
      ],
      video: "videos/let-us-rise.mp4"
  };

  // Send the hero content as JSON
  
  res.json(heroContent);
});


app.get('/api/target-date', (req, res) => {
  const targetDate = process.env.TARGET_DATE;
  if (!targetDate) {
      return res.status(500).json({ error: 'Target date not set' });
  }
  res.json({ targetDate });
});



app.get('/api/reward-content',(req,res)=>{
  const rewardContent = [
      {
          mainrewardImage: "images/selfless supporter.png",
          heading:"Selfless Supporter",
          price: 119,
          contribution:"Partly Contribution for PAIR OF SOVA EASYFLEX GLOVES or ONE PAIR OF SOVA SIMPLEX GLOVES to unsung heros in need.",
          mainrewardinfo :"A heartfelt thank you DIGITAL CERTIFICATE and a CUSTOM SOCIAL MEDIA POST to honour your geneorsity and 10% DISCOUNT on your next Sova order",
          reward2img:"",
          reward2info:"",
          reward3img:"",
          reward3info:"",
          reward4img:"",
          reward4info:"" 
      },
      {
          mainrewardImage: "images/badge.jpg",
          heading:"Helping Hands",
          price:299,
          contribution:"1 PAIR OF SOVA EASYFLEX GLOVES or 2 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need.",
          mainrewardinfo :"A heartfelt thank you CERTIFICATE and DIGITAL SUPPORTER BADGE and a SOCIAL MEDIA POST and 10% DISCOUNT on next Sova order",
          reward2img:"images/helping-hands.png",
          reward2info:"A heartfelt certificate.",
          reward3img:"",
          reward3info:"",
          reward4img:"",
          reward4info:"" 
      },
      {
          mainrewardImage: "images/eco-friendly.jpeg",
          heading:"Dual Impact",
          price:549,
          contribution:"1 PAIR OF SOVA EASYFLEX or 3 PAIRS OF SOVA SIMPLEX to unsung heros in need.",
          mainrewardinfo :"SOVA EASYFLEX GLOVES + ECO-FRIENDLY PEN/ KEYCHAIN + HEARTFELT CERTIFICATE + SUPPORTER BADGE and A SOCIAL MEDIA POST and 10% DISCOUNT on next Sova order",
          reward2img:"images/easy-flex.png",
          reward2info:"Sova EasyFlex Gloves",
          reward3img:"images/Dual-impact.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
      {
          mainrewardImage: "images/penstand.jpeg",
          heading:"Caring Companion",
          price: 899,
          contribution:"2 PAIRS OF SOVA EASYFLEX GLOVES or 4 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need",
          mainrewardinfo :"1 PAIR SOVA DAILYSHIELD GLOVES + PEN STAND + HEARTFELT CERTIFICATE + SUPPORTER BADGE and A SOCIAL MEDIA POST and 10% DISCOUNT on next Sova order",
          reward2img:"images/daily shield.png",
          reward2info:"Sova DailyShield Gloves",
          reward3img:"images/Caring-companion.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
      {
          mainrewardImage: "images/promising-protector-gift.png",
          heading:"Promising Protector",
          price: 1399,
          contribution:"3 PAIRS OF SOVA EASYFLEX GLOVES or 6 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need",
          mainrewardinfo :"1 PAIR SOVA SOFTGUARD GLOVES + INSULATED COFFEE MUG + HEARTFELT CERTIFICATE + SUPPORTER BADGE and a SOCIAL MEDIA POST and 10% discount on next Sova order",
          reward2img:"images/softgaurd1.png",
          reward2info:"Sova SoftGaurd Gloves",
          reward3img:"images/Promising-protector.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
      {
          mainrewardImage: "images/community-hero-gift.png",
          heading:"Community Hero",
          price: 1899,
          contribution:"5 PAIRS OF SOVA EASYFLEX GLOVES or 10 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need and your name on each pair.",
          mainrewardinfo :"1 PAIR SOVA FLEXIPRO GLOVES + TEMPERATURE WATER BOTTLE + heartfelt certificate + supporter badge and a social media post and 10% discount on next Sova order",
          reward2img:"images/flexi-pro1.png",
          reward2info:"Sova Flexi Pro Gloves",
          reward3img:"images/community-hero.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
      {
          mainrewardImage: "images/sova-champion-gift.png",
          heading:"Sova Champion",
          price: 2399,
          contribution:"7 PAIRS OF SOVA EASYFLEX GLOVES or 14 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need and your name on each pair.",
          mainrewardinfo :"1 PAIR SOVA EVERTOUGH GLOVES + VACCUM FLASK SET + heartfelt certificate + supporter badge and a social media post and 10% discount on next Sova order",
          reward2img:"images/ever-tough1.png",
          reward2info:"Sova Ever Tough Gloves",
          reward3img:"images/sova-champion.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
     
      {
          mainrewardImage: "images/architect-of-impact-gift.png",
          heading:"Architect of Impact",
          price: 4999,
          contribution:"15 PAIRS OF SOVA EASYFLEX GLOVES or 25 PAIRS OF SOVA SIMPLEX GLOVES to unsung heros in need and your name on each pair.",
          mainrewardinfo :"1 PAIR OF SOVA HYPERFLEX GLOVES + SOVA SPECIAL GIFT SET + FRAMED CERTIFICATE + supporter badge and a social media post and 10% discount on next Sova order",
          reward2img:"images/hyperflex1.png",
          reward2info:"Sova Hyper Flex Gloves",
          reward3img:"images/Architect of Impact.png",
          reward3info:"Certificate",
          reward4img:"images/badge.jpg",
          reward4info:"Badge" 
      },
     


  ]
  
 
  res.json(rewardContent);

})


app.get('/api/get-stats', async (req, res) => {
  const usersRef = firebaseAdmin.database().ref('users');
  const snapshot = await usersRef.once('value');
  const users = snapshot.val();

  let totalDonation = 100750;
  let totalFarmersReached = 0;
  let totalContributions = 0;

  for (let userId in users) {
    totalDonation += users[userId].totalContribution;
  }

  // Calculate the number of farmers reached and contributions
  totalFarmersReached = Math.floor(totalDonation / 150);
  totalContributions = Object.keys(users).length + 300;  // Add 300 to total entries

  res.json({
    totalDonation,
    totalFarmersReached,
    totalContributions,
  });
});


const videoList = [
  'videos/using-gloves1.mp4',
  'videos/glove-using2.mp4',
  'videos/glove-using3.mp4',
  
];

// Serve video files securely
app.get('/api/getVideos', (req, res) => {
  res.json({ videos: videoList });
});


const productFeatures = [
  {
      id: 'feature1',
      image: 'images/fresh.jpg',
      video: null,
      title: 'Fresh and Odourless Hands',
      description: 'Leave your hands smelling fresh after every use.'
  },
  {
      id: 'feature2',
      image: null,
      video: 'images/waterproof.mp4',
      title: 'Waterproof',
      description: 'Protects against water and keeps your hands dry.'
  },
  {
      id: 'feature3',
      image: null,
      video: 'images/cloth.mp4',
      title: 'Comfortable Lining',
      description: 'Soft cloth lining for all-day comfort.'
  },
  {
      id: 'feature4',
      image: null,
      video: 'images/abrasive.mp4',
      title: 'Abrasive Exterior',
      description: 'Perfect for scrubbing and heavy-duty cleaning.'
  },
  {
      id: 'feature5',
      image: null,
      video: 'images/cut-proof.mp4',
      title: 'Partially Cut-Proof',
      description: 'Reliable protection against sharp objects.'
  },
  {
      id: 'feature6',
      image: null,
      video: 'images/fitting.mp4',
      title: 'Perfect Fit',
      description: 'Snug design ensures ease and comfort.'
  }
];

// Define the route to get product feature data
app.get('/api/product-features', (req, res) => {
  res.json(productFeatures);
});


const products = [
  {
      name: 'Sova Simplex',
      image: 'images/simplex.jpg',
      length: '22cm-26cm',
      features: 'Versatile gloves for, labor, farming, and cleaning!',
      description: 'Durable, flexible gloves with cloth lining, fragrance, and odor-free!',
      price: '75/-',
    },

  {
    name: 'Easy-Flex',
    image: 'images/easy-flex.png',
    length: '32cm-36cm',
    features: 'Versatile gloves for households, labor, farming, and cleaning!',
    description: 'Durable, flexible gloves with cloth lining, fragrance, and odor-free!',
    price: '199/-',
  },
  {
    name: 'Daily Shield',
    image: 'images/daily shield.png',
    length: '42cm-45cm',
    features: 'Essential gloves for home, work, gardening, and more!',
    description: 'Flexible, durable gloves with cloth lining, sweat, and odor control!',
    price: '249/-',
  },
  {
    name: 'Soft Guard',
    image: 'images/Soft-gaurd.png',
    length: '42cm-45cm',
    features: 'Reliable gloves for households, labor, and outdoor tasks.',
    description: 'Durable, flexible gloves with cloth and microfiber lining, odor-free!',
    price: '349/-',
  },
  {
    name: 'Flexi Pro',
    image: 'images/flexi-pro.png',
    length: '42cm-45cm',
    features: 'Perfect for housework, heavy labor, and farming needs!',
    description: 'Durable, flexible, odor-removing, printed designs, abrasive, with cloth and microfiber linings inside.',
    price: '499/-',
  },
  {
    name: 'Ever Tough',
    image: 'images/ever-tough.png',
    length: '42cm-45cm',
    features: 'All-purpose gloves for every job, big or small!',
    description: 'Durable, flexible gloves with cloth and fleece lining, odor-free and abrasive.',
    price: '599/-',
  },
  {
    name: 'Hyper Flex',
    image: 'images/hyper-flex.png',
    length: '42cm-45cm',
    features: 'Designed for cleaning, farming, and daily chores!',
    description: 'Durable, flexible gloves with faux fur and cloth lining, fragrant, odor-removing, and abrasive.',
    price: '749/-',
  },
];

// Route to serve the products page
app.get('/api/products', (req, res) => {
  res.json(products);
});


const donorReviewsDB = firebaseAdmin.database().ref('users');

app.get('/api/donors', async (req, res) => {
    try {
      const snapshot = await donorReviewsDB.once('value');
      const donors = [];
  
      snapshot.forEach((childSnapshot) => {
        donors.push(childSnapshot.val());
      });
  
      donors.reverse(); // Ensure the most recent donors are first
      res.json(donors); // Send the donor data as a JSON response
    } catch (error) {
      console.error('Error fetching donor data:', error);
      res.status(500).send('Error fetching donor data');
    }
  });



  app.post('/api/send-email', (req, res) => {
    const { name, email, message } = req.body; // Get the form data

    // Create a Nodemailer transporter using your email provider
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like SMTP or SendGrid
        auth: {
            user: 'sovaeffortlesscleaning@gmail.com', // Replace with your email
            pass: process.env.EMAIL_PASS,   // Replace with your email password or app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: email,          // Sender email (user's email)
        to: 'sovaeffortlesscleaning@gmail.com', // Your email address (where the email will be sent)
        subject: 'New Message from Contact Form',
        text: `You have a new message from ${name} (${email}):\n\n${message}`
    };

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('Message sent successfully!');
    });
});


// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});