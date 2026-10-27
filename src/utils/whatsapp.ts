/**
 * BRNDNUR Advisory LLP — Context-Aware WhatsApp Enquiry System
 * Generates structured, professional, context-specific WhatsApp click-to-chat URLs.
 */

export const WHATSAPP_PHONE = '919048188899';

export interface WhatsAppMessageOptions {
  pageName: string;
  sectionName: string;
  enquiryType: string;
  greeting?: string;
  topic: string;
  details?: string;
  callToAction?: string;
  phone?: string;
}

/**
 * Builds the human-readable multi-line WhatsApp message.
 */
export function buildWhatsAppMessage(options: WhatsAppMessageOptions): string {
  const greeting = options.greeting || 'Hello BRNDNUR Team,';
  const cta = options.callToAction || 'Could you please guide me on the suitable service for my requirements and the next steps?';

  const parts: string[] = [greeting, '', options.topic];

  if (options.details && options.details.trim().length > 0) {
    parts.push('', options.details.trim());
  }

  parts.push('', cta);
  parts.push('', `Website source: ${options.pageName} — ${options.sectionName}`);
  parts.push(`Enquiry type: ${options.enquiryType}`);

  return parts.join('\n');
}

/**
 * Safely encodes a message into a standard wa.me URL.
 */
export function buildWhatsAppUrl(options: WhatsAppMessageOptions): string {
  const phone = options.phone || WHATSAPP_PHONE;
  const message = buildWhatsAppMessage(options);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Resolves context-aware WhatsApp URL for the Floating WhatsApp button based on current route.
 */
export function getFloatingWhatsAppUrl(currentPath: string = '/', pageTitle?: string): string {
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';

  switch (cleanPath) {
    case '/trademark-registration':
      return buildWhatsAppUrl({
        pageName: 'Trademark Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'General Trademark Assistance',
        topic: 'I am currently viewing your Trademark Registration page and would like assistance with my enquiry.',
        callToAction: 'Could you please guide me on the process and suitable next steps?'
      });

    case '/brand-name-search':
      return buildWhatsAppUrl({
        pageName: 'Brand Name Search Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Clearance Search',
        topic: 'I am currently viewing your Brand Name Search page and would like assistance checking trademark availability for my brand.',
        details: 'Proposed brand name: [Please enter your brand name]',
        callToAction: 'Could you please guide me on the availability assessment and next steps?'
      });

    case '/trademark-classes':
      return buildWhatsAppUrl({
        pageName: 'Trademark Classes Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Class Selection',
        topic: 'I am currently viewing your Trademark Classes page and need assistance identifying the appropriate class or classes for my business.',
        details: 'Business or brand name: [Please enter]\nProducts or services: [Please describe]',
        callToAction: 'Could you please guide me on the suitable classes and registration process?'
      });

    case '/wordmark-registration':
      return buildWhatsAppUrl({
        pageName: 'Wordmark Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Wordmark Registration',
        topic: 'I am currently viewing your Wordmark Registration page and would like assistance protecting my brand name as a wordmark.',
        details: 'Proposed wordmark: [Please enter your brand name]',
        callToAction: 'Could you please explain the wordmark filing process, government fees, and next steps?'
      });

    case '/logo-trademark-registration':
      return buildWhatsAppUrl({
        pageName: 'Logo Trademark Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Logo & Device Mark Protection',
        topic: 'I am currently viewing your Logo Trademark Registration page and would like guidance on protecting my logo or device mark.',
        details: 'Brand / logo concept: [Please describe your logo]',
        callToAction: 'Could you please explain how to submit my logo for diagnostic review and the applicable fees?'
      });

    case '/trademark-renewal':
      return buildWhatsAppUrl({
        pageName: 'Trademark Renewal Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Renewal & Maintenance',
        topic: 'I am currently viewing your Trademark Renewal page and need assistance checking renewal dates or filing for renewal.',
        details: 'Trademark / Application Number: [Please enter if known]',
        callToAction: 'Could you please verify my renewal status and advise on statutory procedures?'
      });

    case '/trademark-monitoring':
      return buildWhatsAppUrl({
        pageName: 'Trademark Monitoring Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Brand Watch Surveillance',
        topic: 'I am currently viewing your Trademark Monitoring page and would like to learn more about Brand Watch surveillance.',
        callToAction: 'Could you please share monitoring scope, weekly journal surveillance details, and pricing?'
      });

    case '/gst-registration':
      return buildWhatsAppUrl({
        pageName: 'GST Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'GST Registration',
        topic: 'I am currently viewing your GST Registration page and would like assistance with GST registration for my business.',
        details: 'Nature of business: [e.g. Retail, Trading, Services, Manufacturing]',
        callToAction: 'Could you please explain the applicable requirements, documents, service charges, and next steps?'
      });

    case '/udyam-msme-registration':
      return buildWhatsAppUrl({
        pageName: 'Udyam MSME Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Udyam MSME Registration',
        topic: 'I am currently viewing your Udyam MSME Registration page and need assistance securing MSME registration.',
        details: 'Business enterprise type: [e.g. Proprietorship, Partnership, LLP, Pvt Ltd]',
        callToAction: 'Could you please explain the required documents, 50% trademark fee discount eligibility, and next steps?'
      });

    case '/fssai-registration':
      return buildWhatsAppUrl({
        pageName: 'FSSAI Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'FSSAI Food Business Licensing',
        topic: 'I am currently viewing your FSSAI Registration page and need assistance with food business registration or licensing.',
        details: 'Food business category: [e.g. Restaurant, Packaged Food, Cloud Kitchen, Distributor]',
        callToAction: 'Could you please guide me on the applicable license type, required documents, and next steps?'
      });

    case '/business-setup':
      return buildWhatsAppUrl({
        pageName: 'Business Setup Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Business Setup Advisory',
        topic: 'I am currently viewing your Business Setup Advisory page and would like assistance structuring and registering my business in Kerala.',
        details: 'Proposed business model: [Please describe briefly]',
        callToAction: 'Could you please guide me on suitable entity forms, required licenses, and the advisory roadmap?'
      });

    case '/services':
      return buildWhatsAppUrl({
        pageName: 'Services Hub',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Services Portfolio Enquiry',
        topic: 'I am reviewing your complete services portfolio and would like guidance on the most suitable service package for my enterprise.',
        details: 'My primary interest is: [e.g. Trademark, GST, Food Licensing, Startup Setup]',
        callToAction: 'Could you please advise me on how to get started?'
      });

    case '/packages':
      return buildWhatsAppUrl({
        pageName: 'Packages & Pricing Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Package Pricing & Scope',
        topic: 'I am viewing your Packages & Pricing page and would like assistance selecting the right package for my business.',
        details: 'Package of interest: [e.g. Brand Starter, Trademark, Food Brand, Gulf Return]',
        callToAction: 'Could you please share current package inclusions, government fees, and the onboarding process?'
      });

    case '/packages/individual-msme':
      return buildWhatsAppUrl({
        pageName: 'Packages — Individual & MSME',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Individual & MSME Package',
        topic: 'I am reviewing the Individual & MSME Trademark Package and would like to request a formal quotation.',
        details: 'Business / Brand name: [Please enter]',
        callToAction: 'Could you please share the complete fee breakdown, government fee concessions, and documents needed?'
      });

    case '/packages/company-llp':
      return buildWhatsAppUrl({
        pageName: 'Packages — Company & LLP',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Company & LLP Package',
        topic: 'I am reviewing the Company & LLP Trademark Package and would like to request a corporate quotation.',
        details: 'Company / LLP Name: [Please enter]',
        callToAction: 'Could you please share the corporate scope, multi-class support, statutory fee schedule, and next steps?'
      });

    case '/packages/food-brand':
      return buildWhatsAppUrl({
        pageName: 'Packages — Food Brand Package',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Food Brand Setup & Licensing',
        topic: 'I am reviewing the Food Brand Package and would like assistance with integrated Trademark and FSSAI licensing.',
        details: 'Food product / brand concept: [Please describe]',
        callToAction: 'Could you please share the complete package scope, statutory fees, and timelines?'
      });

    case '/packages/gulf-return-business':
      return buildWhatsAppUrl({
        pageName: 'Packages — Gulf Return Business',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Gulf Return NRI Business Setup',
        topic: 'I am reviewing the Gulf-Return Business Package and would like to discuss launching a commercial venture in Kerala.',
        details: 'Current location / Gulf country: [e.g. UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain]',
        callToAction: 'Could you please arrange a remote advisory consultation to discuss entity setup and brand clearance?'
      });

    case '/how-it-works':
      return buildWhatsAppUrl({
        pageName: 'How It Works Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Service Process Guidance',
        topic: 'I have reviewed your 4-step advisory process and would like guidance on getting started with my enquiry.',
        callToAction: 'Could you please explain the first step and the initial information I should prepare?'
      });

    case '/faqs':
      return buildWhatsAppUrl({
        pageName: 'Frequently Asked Questions',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'FAQ Follow-up Enquiry',
        topic: 'I have reviewed the frequently asked questions on your website but need some additional clarification.',
        details: 'My question or requirement is: [Please describe your question]',
        callToAction: 'Could you please provide clarification on this requirement?'
      });

    case '/contact':
      return buildWhatsAppUrl({
        pageName: 'Contact Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'General Advisory Enquiry',
        topic: 'I visited your contact page and would like to discuss my business requirements directly with an advisor.',
        callToAction: 'Could you please help me identify the appropriate service and explain how to proceed?'
      });

    case '/about':
      return buildWhatsAppUrl({
        pageName: 'About BRNDNUR Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Advisory Consultation',
        topic: 'I read about BRNDNUR Advisory LLP and would like to discuss brand protection and statutory registrations.',
        callToAction: 'Could you please explain how your advisory practice assists businesses like mine?'
      });

    default:
      if (cleanPath.startsWith('/resources')) {
        const title = pageTitle ? `"${pageTitle}"` : 'your resource guides';
        return buildWhatsAppUrl({
          pageName: pageTitle || 'Resources Hub',
          sectionName: 'Floating WhatsApp Button',
          enquiryType: 'Resource Advisory Guidance',
          topic: `I am currently reading ${title} on your website and would like guidance on this topic for my business.`,
          details: 'My specific requirement is: [Please describe briefly]',
          callToAction: 'Could you please assist me with the advisory process and next steps?'
        });
      }

      return buildWhatsAppUrl({
        pageName: pageTitle || 'Website',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'General Consultation',
        topic: 'I visited your website and would like to enquire about your trademark and business registration services.',
        callToAction: 'Could you please guide me on the suitable service for my requirements and the next steps?'
      });
  }
}

/**
 * Resolves context-aware WhatsApp URL for the Navigation Header CTA ("Get in Touch").
 */
export function getHeaderWhatsAppUrl(currentPath: string = '/'): string {
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';

  switch (cleanPath) {
    case '/trademark-registration':
    case '/brand-name-search':
    case '/trademark-classes':
    case '/wordmark-registration':
    case '/logo-trademark-registration':
    case '/trademark-renewal':
    case '/trademark-monitoring':
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'Trademark Advisory Enquiry',
        topic: 'I am browsing your brand and trademark protection services and would like to speak with an advisor.',
        callToAction: 'Could you please guide me on trademark filing procedures, class selection, and professional charges?'
      });

    case '/gst-registration':
    case '/udyam-msme-registration':
    case '/fssai-registration':
    case '/business-setup':
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'Business Registration Enquiry',
        topic: 'I am browsing your business registration services and would like assistance with statutory licensing.',
        callToAction: 'Could you please explain the document requirements, government timelines, and next steps?'
      });

    case '/packages':
    case '/packages/individual-msme':
    case '/packages/company-llp':
    case '/packages/food-brand':
    case '/packages/gulf-return-business':
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'Package Consultation',
        topic: 'I am reviewing your service packages and would like to discuss a customized scope for my business.',
        callToAction: 'Could you please share current package pricing, government fee concessions, and onboarding steps?'
      });

    default:
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'General Advisory Consultation',
        topic: 'I visited your website and would like to get in touch regarding your trademark and business registration services.',
        callToAction: 'Could you please guide me on the suitable service for my requirements and how to proceed?'
      });
  }
}

/**
 * Resolves context-aware WhatsApp URL for the Website Footer.
 */
export function getFooterWhatsAppUrl(): string {
  return buildWhatsAppUrl({
    pageName: 'Website Footer',
    sectionName: 'Direct WhatsApp Contact',
    enquiryType: 'General Enquiry',
    topic: 'I visited your website and would like more information about your advisory services.',
    details: 'My enquiry is regarding: [Please describe your requirement]',
    callToAction: 'Could you please connect me with an advisory coordinator to discuss next steps?'
  });
}
