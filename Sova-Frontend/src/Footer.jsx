import React, { Component } from 'react';


class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent1: false,
      showContent2: false,
      showContent3: false,
    };
    this.divRef1 = React.createRef();
    this.divRef2 = React.createRef();
    this.divRef3 = React.createRef();
  }

  componentDidMount() {
    // Add event listener to detect clicks outside of any of the divs
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    // Clean up event listener
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleDivClick = (divNumber) => {
    this.setState((prevState) => ({
      [`showContent${divNumber}`]: !prevState[`showContent${divNumber}`],
    }));
  };

  handleOutsideClick = (event) => {
    // Check if the click is outside of any of the divs
    if (
      (this.divRef1.current && !this.divRef1.current.contains(event.target)) &&
      (this.divRef2.current && !this.divRef2.current.contains(event.target)) &&
      (this.divRef3.current && !this.divRef3.current.contains(event.target))
    ) {
      this.setState({
        showContent1: false,
        showContent2: false,
        showContent3: false,
      });
    }
  };

  render() {
    return (
      <div className="popup">
        {/* Div 1 */}
        <div
          ref={this.divRef1}
          onClick={() => this.handleDivClick(1)}
          className="toggle-div"
        >
          Terms & Conditions
        </div>
        {this.state.showContent1 && (
          <div className=".popup-content">
            <p><strong> Introduction</strong><br />Welcome to the Sova Gloves Mission. By accessing or using our website and services, you agree to comply with these Terms of Service, our Privacy Policy, and other relevant policies. If you do not agree to these terms, please refrain from using our website or participating in the crowdfunding campaign.</p>

<p><strong>Mission Overview</strong><br />Sova Gloves Mission is dedicated to the manufacturing and distribution of high-quality gloves to individuals in need, such as farmers, laborers, and others who require hand protection in their daily lives. The funds raised through this mission will be used solely for the purpose outlined in the mission, and by participating, you agree to contribute to this mission.</p>

<p><strong>Contributions</strong><br />By contributing to this mission, you acknowledge and agree that:
  <ul style={{ listStyleType: 'decimal' }}>
    <li>Your contribution is voluntary and non-refundable once made.</li>
    <li>Your contribution is not a donation, and it will be treated as a contribution to the mission to receive rewards based on your chosen tier.</li>
    <li>All contributions are subject to the availability of rewards and fulfillment timelines as outlined in the mission.</li>
  </ul>
</p>

<p><strong>Use of Funds</strong><br />All funds raised through this mission will be used exclusively for:
  <ul style={{ listStyleType: 'decimal' }}>
    <li>Manufacturing and production of Sova Gloves.</li>
    <li>Packaging, shipping, and fulfillment of rewards.</li>
    <li>Marketing and promotional activities related to the mission.</li>
    <li>Covering operational expenses and supporting the overall movement goals.</li>
  </ul>
  Any unused funds, after fulfillment, will be allocated towards the continued growth and improvement of the business and the Sova Gloves brand.
</p>

<p><strong>Terms of Use</strong></p>
<p>To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.</p>

<p>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>

<p>Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.</p>

<p>The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.</p>

<p>You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.</p>

<p>You agree to pay us the charges associated with availing the Services.</p>

<p>You agree not to use the website and/or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.</p>

<p>You agree and acknowledge that website and the Services may contain links to other third-party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third-party websites.</p>

<p>You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with us for the Services.</p>

<p>You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service. The timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable). In case you do not raise a refund claim within the stipulated time, then this would make you ineligible for a refund.</p>

<p>Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.</p>

<p>These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.</p>

<p>All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Sinnar, Maharashtra.</p>

<p>All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.</p>

<p><strong> Rewards</strong><br />Upon successful contribution, you will receive a reward as described on the web page. The delivery of rewards will be initiated within 15-20 days from the date of contribution, subject to availability and fulfillment processes. We reserve the right to substitute rewards with comparable items if necessary. The rewards for needy ones will be processed in 7-10 days.</p>

<p><strong> Cancellation of Campaign</strong><br />Sova Gloves reserves the right to cancel or suspend the crowdfunding campaign at any time. In the event of a cancellation, contributors will be notified, and funds will be refunded. However, if the campaign successfully reaches its funding goal, the campaign will proceed as planned, and no cancellations will be entertained after that point.</p>

<p><strong> Limitation of Liability</strong><br />Sova Gloves, its affiliates, or any related parties will not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website or participation in the campaign. We do not guarantee the outcome of the campaign, and we are not responsible for any delays or issues in fulfillment, delivery, or other aspects of the campaign which are not under our control.</p>

<p><strong> Privacy and Data Protection</strong><br />By participating in the campaign, you agree to our Privacy Policy, which outlines how we collect, use, and protect your personal information. We are committed to safeguarding your privacy and ensuring that your data is used only for the purpose of the campaign and related communications.</p>

<p><strong> No Tax Exemption</strong><br />It is important to note that Sova Gloves is not a non-governmental organization (NGO), and contributions made to this crowdfunding campaign are not tax-deductible. Participants will not be eligible for any tax exemptions or benefits associated with their contributions.</p>

<p><strong> Governing Law</strong><br />These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in India.</p>

<p><strong>Changes to Terms of Service</strong><br />Sova Gloves reserves the right to modify or update these Terms of Service at any time. Any changes will be posted on this page, and the updated terms will take effect immediately. We recommend reviewing this page periodically to stay informed about any changes to the terms.</p>

<p><strong>Contact Information</strong><br />If you have any questions or concerns regarding these Terms of Service or any aspect of the Sova Gloves crowdfunding campaign, please contact us at:<br />
  Email: sovaeffortlesscleaning@gmail.com
  Phone : +91 9325883978
</p>
          </div>
        )}

        {/* Div 2 */}
        <div
          ref={this.divRef2}
          onClick={() => this.handleDivClick(2)}
          className="toggle-div"
        >
          Privacy Policy
        </div>
        {this.state.showContent2 && (
          <div className=".popup-content">
            <p><strong>1. Introduction</strong><br />At Sova Gloves, we take your privacy very seriously and are committed to protecting the personal data you share with us. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you participate in our crowdfunding campaign. By using our website and engaging with our campaign, you consent to the terms and practices described in this policy. If you disagree with any of the terms, please refrain from using the website and providing personal information.</p>

<p><strong>2. Information We Collect</strong><br />We collect the following information from our users:
  <ul style={{ listStyleType: "decimal" }}>
    <li><strong>Personal Information:</strong> When you contribute to the crowdfunding campaign, we ask for personal details such as your name, email address, phone number, shipping address, and payment information. This information is necessary to process your contribution, fulfill rewards, and communicate with you.</li>
  </ul>
</p>

<p><strong>3. How We Use Your Information</strong><br />The personal information we collect is used for the following purposes:
  <ul style={{ listStyleType: "decimal" }}>
    <li><strong>To Process Contributions:</strong> We use your payment and contact details to process your contributions, confirm your participation in the crowdfunding campaign, and deliver rewards as per the campaign guidelines.</li>
    <li><strong>To Communicate with You:</strong> We may send you emails, newsletters, or notifications regarding campaign updates, new product launches, promotions, or important information related to your contribution. If you opt-in, we may also send promotional offers and other marketing communications.</li>
    <li><strong>To Fulfill Rewards:</strong> Your information will be used to ensure the timely delivery of rewards promised to contributors based on their selected contribution tier.</li>
  </ul>
</p>

<p><strong>4. Data Protection and Security</strong><br />We implement a variety of security measures to safeguard your personal information. This includes the use of encryption for sensitive information such as payment details and employing firewalls and secure servers. Despite these efforts, please understand that no method of data transmission over the internet is 100% secure, and we cannot guarantee absolute security of your data. You are responsible for maintaining the confidentiality of your login details and other personal account information.</p>

<p><strong>5. Sharing of Information</strong><br />We do not sell, trade, or rent your personal information to third parties. However, we may share your data in the following circumstances:
  <ul style={{ listStyleType: "decimal" }}>
    <li><strong>With Third-Party Service Providers:</strong> We may share your information with trusted partners who help us run the campaign, process payments, ship rewards, and handle customer service inquiries. These service providers are only authorized to use your information for the specific purpose for which it was provided.</li>
    <li><strong>With Legal Authorities:</strong> If required by law, we may disclose your personal information to comply with a subpoena, court order, or other legal process.</li>
    <li><strong>In the Event of Business Transfers:</strong> In case of a merger, acquisition, or sale of assets, your personal information may be transferred as part of the transaction, but we will notify you of any such changes.</li>
  </ul>
</p>

<p><strong>7. Third-Party Links</strong><br />Our website may contain links to external websites, including social media platforms or third-party services. These sites have their own privacy policies, and we are not responsible for the content or practices of those sites. We encourage you to review the privacy policies of any third-party websites you visit before sharing any personal information.</p>

<p><strong>8. Data Retention</strong><br />We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including for any legal, accounting, or reporting requirements. If you no longer wish to receive communications from us, you can unsubscribe or request that we delete your data. After the data retention period, your information will be securely deleted or anonymized.</p>

<p><strong>9. Your Rights and Choices</strong><br />You have the right to:
  <ul style={{ listStyleType: "decimal" }}>
    <li>Access the personal data we hold about you and request corrections if necessary.</li>
    <li>Request the deletion of your personal data, subject to certain legal obligations.</li>
    <li>Withdraw your consent for data processing (where applicable) at any time.</li>
    <li>Opt-out of marketing communications or unsubscribe from our newsletters.</li>
  </ul>
  If you would like to exercise any of these rights, please contact us using the contact details provided below.
</p>

<p><strong>10. Sova Gloves as a Business</strong><br />Please note that Sova Gloves is not a non-governmental organization (NGO), and this crowdfunding campaign does not offer tax exemptions. Contributions made to this campaign are considered as voluntary contributions to a business venture, and they are not tax-deductible. By participating, you understand and agree that no tax benefits are provided through your contributions.</p>

<p><strong>11. Changes to Privacy Policy</strong><br />We reserve the right to update or modify this Privacy Policy at any time. Any changes to the policy will be posted on this page, and the updated policy will take effect immediately after posting. We encourage you to periodically review this Privacy Policy for any updates or changes. By continuing to use the website after such updates, you agree to the revised policy.</p>

          </div>
        )}

        {/* Div 3 */}
        <div
          ref={this.divRef3}
          onClick={() => this.handleDivClick(3)}
          className="toggle-div"
        >
          Refund Policy
        </div>
        {this.state.showContent3 && (
          <div className=".popup-content">
            <p>
        Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
      </p>

      <p>
        Sova Gloves does not accept cancellation requests for perishable items like flowers, eatables, etc. However, a refund/replacement can be made if the customer establishes that the quality of the product delivered is not good.
      </p>

      <p>
        In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at their end. This should be reported within the same day of receipt of the products. If you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within the same day of receiving the product. The Customer Service Team, after reviewing your complaint, will take an appropriate decision.
      </p>

      <p>
        In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any refunds approved by Sova Gloves, it’ll take 9-15 days for the refund to be processed to the end customer.
      </p>

      <p>
        <strong>Payment Gateway Responsibility</strong><br />
        The payment gateway provider is responsible for handling payment processing and securing payments. All payments made are securely processed through a third-party gateway, and once the transaction is completed, it cannot be undone except under the conditions mentioned above (such as campaign cancellation or defective product claims). In the case of any issues with the payment, we will work with the payment provider to resolve the matter as quickly as possible.
      </p>
          </div>
        )}
      </div>
    );
  }
}

export default Footer;