/**
 * BRNDNUR Advisory LLP — Context-Aware WhatsApp Enquiry System
 * Generates natural, professional, context-specific WhatsApp click-to-chat URLs.
 */

export const WHATSAPP_PHONE = '919048188899';

export interface WhatsAppMessageOptions {
  pageName?: string;
  sectionName?: string;
  enquiryType?: string;
  greeting?: string;
  topic?: string;
  details?: string;
  callToAction?: string;
  phone?: string;
  message?: string;
  directMessage?: string;
}

/**
 * Builds the human-readable multi-line WhatsApp message.
 * Strict conversion quality:
 * - 20–50 words (aims for 25–35 words)
 * - Professional, polite, customer perspective
 * - No bracketed placeholders ([Please enter...])
 * - No robotic metadata (Website source: ..., Enquiry type: ...)
 */
export function buildWhatsAppMessage(options: WhatsAppMessageOptions): string {
  if (options.message && options.message.trim().length > 0) {
    return options.message.trim();
  }
  if (options.directMessage && options.directMessage.trim().length > 0) {
    return options.directMessage.trim();
  }

  const greeting = options.greeting || 'Hi BRNDNUR,';
  const cta = options.callToAction || 'Could you please guide me on the suitable service for my requirements and the next steps?';

  const parts: string[] = [greeting];

  if (options.topic && options.topic.trim().length > 0) {
    parts.push('', options.topic.trim());
  }

  if (options.details && options.details.trim().length > 0) {
    // Strip any bracketed placeholders if present
    const cleanDetails = options.details.trim().replace(/\[.*?\]/g, '').trim();
    if (cleanDetails.length > 0) {
      parts.push('', cleanDetails);
    }
  }

  if (cta && cta.trim().length > 0) {
    parts.push('', cta.trim());
  }

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
        message: 'Hi BRNDNUR, I am looking into trademark registration for my brand. Could you please guide me on conducting a clearance search, required documents, government filing fees, and the overall registration process?'
      });

    case '/brand-name-search':
      return buildWhatsAppUrl({
        pageName: 'Brand Name Search Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Clearance Search',
        message: 'Hi BRNDNUR, I would like to check whether my proposed business name may conflict with existing trademarks. Please guide me on the name-search process, the information you need, and the available options before I proceed with registration.'
      });

    case '/trademark-classes':
      return buildWhatsAppUrl({
        pageName: 'Trademark Classes Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Class Selection',
        message: 'Hi BRNDNUR, I need guidance on selecting the correct trademark classes for my business goods and services. Could you please explain the classification under NICE guidelines, multi-class filing fees, and the next steps?'
      });

    case '/wordmark-registration':
      return buildWhatsAppUrl({
        pageName: 'Wordmark Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Wordmark Registration',
        message: 'Hi BRNDNUR, I am interested in wordmark registration for my brand. Could you please guide me through the name availability check, required documents, applicable government fees, professional service charges, and the next steps for applying?'
      });

    case '/logo-trademark-registration':
      return buildWhatsAppUrl({
        pageName: 'Logo Trademark Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Logo & Device Mark Protection',
        message: 'Hi BRNDNUR, I would like to understand the registration process for my brand logo. Could you please explain the required artwork, relevant trademark class, application documents, applicable fees, and the next steps for protecting my visual brand identity?'
      });

    case '/trademark-renewal':
      return buildWhatsAppUrl({
        pageName: 'Trademark Renewal Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Trademark Renewal & Maintenance',
        message: 'Hi BRNDNUR, I need guidance on renewing my trademark registration. Could you please help me understand the renewal timeline, information and documents required, applicable government fees, professional charges, and the next steps based on my trademark\'s current status?'
      });

    case '/trademark-monitoring':
      return buildWhatsAppUrl({
        pageName: 'Trademark Monitoring Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Brand Watch Surveillance',
        message: 'Hi BRNDNUR, I would like to enquire about Brand Watch trademark surveillance for my brand. Could you please explain your Trade Marks Journal monitoring process, weekly conflict alerts, subscription terms, and how to get started?'
      });

    case '/gst-registration':
      return buildWhatsAppUrl({
        pageName: 'GST Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'GST Registration',
        message: 'Hi BRNDNUR, I am enquiring about GST registration for my business. Could you please explain the applicable eligibility requirements, documents needed, service charges, government fees if applicable, and the steps required to complete the registration?'
      });

    case '/udyam-msme-registration':
      return buildWhatsAppUrl({
        pageName: 'Udyam MSME Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Udyam MSME Registration',
        message: 'Hi BRNDNUR, I would like assistance with Udyam MSME registration for my enterprise. Could you please explain the eligibility requirements, required documentation, the 50% statutory trademark fee concession, and the next steps?'
      });

    case '/fssai-registration':
      return buildWhatsAppUrl({
        pageName: 'FSSAI Registration Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'FSSAI Food Business Licensing',
        message: 'Hi BRNDNUR, I am seeking guidance on FSSAI registration and licensing for my food business. Could you please advise me on basic registration versus state license requirements, necessary documents, fee structures, and the application timeline?'
      });

    case '/business-setup':
      return buildWhatsAppUrl({
        pageName: 'Business Setup Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Business Setup Advisory',
        message: 'Hi BRNDNUR, I would like advisory assistance with setting up a new business entity in Kerala. Could you please guide me on choosing between a proprietorship, partnership, LLP, or private limited company, along with statutory registrations and estimated timelines?'
      });

    case '/services':
      return buildWhatsAppUrl({
        pageName: 'Services Hub',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Services Portfolio Enquiry',
        message: 'Hi BRNDNUR, I am reviewing your advisory services portfolio and would like guidance on the most suitable service for my enterprise. Could you please advise on preliminary consultation steps, professional charges, and how we can get started?'
      });

    case '/packages':
      return buildWhatsAppUrl({
        pageName: 'Packages & Pricing Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Package Pricing & Scope',
        message: 'Hi BRNDNUR, I am reviewing your fixed-fee packages and would like help selecting the right package for my business. Could you please share the current scope of inclusions, statutory fee breakdown, and onboarding procedure?'
      });

    case '/packages/individual-msme':
      return buildWhatsAppUrl({
        pageName: 'Packages — Individual & MSME',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Individual & MSME Package',
        message: 'Hi BRNDNUR, I would like to enquire about your Individual and MSME Trademark Package. Could you please explain the package inclusions, government fee concession eligibility, documentation needed, and the steps to begin my filing?'
      });

    case '/packages/company-llp':
      return buildWhatsAppUrl({
        pageName: 'Packages — Company & LLP',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Company & LLP Package',
        message: 'Hi BRNDNUR, I am enquiring about your Company and LLP Trademark Package. Could you please share the corporate filing scope, statutory fee schedules, multi-class support options, and the onboarding process for corporate entities?'
      });

    case '/packages/food-brand':
      return buildWhatsAppUrl({
        pageName: 'Packages — Food Brand Package',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Food Brand Setup & Licensing',
        message: 'Hi BRNDNUR, I am interested in your integrated Food Brand Package combining trademark registration and FSSAI licensing. Could you please explain the package deliverables, statutory fees, required documents, and expected processing timelines?'
      });

    case '/packages/gulf-return-business':
      return buildWhatsAppUrl({
        pageName: 'Packages — Gulf Return Business',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Gulf Return NRI Business Setup',
        message: 'Hi BRNDNUR, I am an NRI planning to establish a commercial venture in Kerala and would like guidance on your Gulf Return Business Package. Could you please explain your remote advisory setup, entity formation, and brand protection roadmaps?'
      });

    case '/how-it-works':
      return buildWhatsAppUrl({
        pageName: 'How It Works Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Service Process Guidance',
        message: 'Hi BRNDNUR, I have reviewed your 4-stage advisory workflow and would like to get started with my business enquiry. Could you please explain the initial consultation step and what specific information I should have ready?'
      });

    case '/faqs':
      return buildWhatsAppUrl({
        pageName: 'Frequently Asked Questions',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'FAQ Follow-up Enquiry',
        message: 'Hi BRNDNUR, I have reviewed your frequently asked questions but have a specific query regarding trademark registration and business setup. Could you please connect me with an advisor to discuss my requirement?'
      });

    case '/contact':
      return buildWhatsAppUrl({
        pageName: 'Contact Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'General Advisory Enquiry',
        message: 'Hi BRNDNUR, I visited your contact page and would like to speak directly with an advisor regarding my business registration or brand protection requirement. Could you please advise on how to proceed?'
      });

    case '/about':
      return buildWhatsAppUrl({
        pageName: 'About BRNDNUR Page',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'Advisory Consultation',
        message: 'Hi BRNDNUR, I read about BRNDNUR Advisory LLP and would like to discuss brand protection and statutory registrations. Could you please explain how your advisory practice assists businesses like mine and the next steps?'
      });

    default:
      if (cleanPath.startsWith('/resources')) {
        const title = pageTitle ? `"${pageTitle}"` : 'your resource guides';
        return buildWhatsAppUrl({
          pageName: pageTitle || 'Resources Hub',
          sectionName: 'Floating WhatsApp Button',
          enquiryType: 'Resource Advisory Guidance',
          message: `Hi BRNDNUR, I am reading ${title} on your website and would like guidance on this topic for my business. Could you please explain the applicable requirements, advisory process, and next steps?`
        });
      }

      return buildWhatsAppUrl({
        pageName: pageTitle || 'Website',
        sectionName: 'Floating WhatsApp Button',
        enquiryType: 'General Consultation',
        message: 'Hi BRNDNUR, I would like to discuss a business registration or brand-protection requirement. Could you please understand my requirement and guide me towards the relevant service, required information, applicable fees, and the next steps?'
      });
  }
}

/**
 * Resolves context-aware WhatsApp URL for the Navigation Header CTA ("Free Name Check").
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
    case '/trademark-renewal-monitoring':
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'Trademark Advisory Enquiry',
        message: 'Hi BRNDNUR, I would like to request a free preliminary brand name check to verify whether my proposed name conflicts with existing trademarks. Could you please guide me on the search process and next steps?'
      });

    case '/business-registration':
    case '/gst-registration':
    case '/udyam-msme-registration':
    case '/fssai-registration':
    case '/business-setup':
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'Business Registration Enquiry',
        message: 'Hi BRNDNUR, I am browsing your business registration services and would like guidance on GST, MSME, or FSSAI licensing for my business. Could you please explain the required documents, charges, and next steps?'
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
        message: 'Hi BRNDNUR, I am reviewing your fixed-fee service packages and would like assistance selecting the right package for my enterprise. Could you please share package details, government fee concessions, and next steps?'
      });

    default:
      return buildWhatsAppUrl({
        pageName: 'Site Header',
        sectionName: 'Main Navigation CTA',
        enquiryType: 'General Advisory Consultation',
        message: 'Hi BRNDNUR, I would like to request a free preliminary brand name check for my business. Could you please guide me through the availability check, required details, and the next steps for protecting my brand?'
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
    message: 'Hi BRNDNUR, I visited your website and would like to speak with an advisor regarding brand protection and business registration. Could you please guide me towards the relevant service, applicable fees, and the next steps?'
  });
}
