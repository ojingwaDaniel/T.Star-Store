import { SITE } from "./site";
import { formatNaira } from "@/utils/currency";

// Tokens like {email} are filled in by fillPolicyText.
export function fillPolicyText(text) {
  return String(text)
    .replaceAll("{email}", SITE.email)
    .replaceAll("{name}", SITE.name)
    .replaceAll("{threshold}", formatNaira(SITE.freeDeliveryThreshold));
}

// DRAFT TEMPLATES, not legal advice. Review with a lawyer, then set draft: false.
export const POLICIES = {
  privacy: {
    title: "Privacy Policy",
    updated: "16 November 2026",
    draft: false,
    intro: "How {name} collects, uses and protects your personal information.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "When you shop with us or contact us we collect the details you give us:",
        ],
        list: [
          "Your name, email address and phone number",
          "Your delivery address",
          "Your order history",
          "Messages you send us",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We use your information to process and deliver orders, contact you about them, answer your questions, and (only if you subscribed) send you news and offers. You can unsubscribe at any time.",
        ],
      },
      {
        heading: "Payments",
        paragraphs: [
          "Card and bank details are handled by our payment provider and are never stored on our website. We only receive confirmation of whether a payment succeeded.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "Your cart, wishlist and sign-in session are stored in your browser so they are still there when you return. You can clear them at any time in your browser settings.",
        ],
      },
      {
        heading: "Sharing your information",
        paragraphs: [
          "We share only what is needed with delivery partners and payment providers to fulfil your order. We do not sell your personal information.",
        ],
      },
      {
        heading: "Keeping it safe",
        paragraphs: [
          "We take reasonable steps to protect your information and keep it only as long as we need it for orders, accounting and legal obligations.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under Nigerian data protection law you can ask to see, correct or delete the information we hold about you, and to object to its use for marketing. Email {email} to make a request.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: ["Questions about this policy? Email {email}."],
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    updated: "16 November 2026",
    draft: true,
    intro: "The rules for using the {name} website and buying from us.",
    sections: [
      {
        heading: "Using this website",
        paragraphs: [
          "By using this site or placing an order you agree to these terms. Please do not use the site if you do not agree.",
        ],
      },
      {
        heading: "Products and prices",
        paragraphs: [
          "All prices are in Nigerian Naira (₦). We try to display colours and details accurately, but your screen may show colours slightly differently. If we spot a pricing error we may cancel the order and refund you in full.",
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "Placing an order is an offer to buy. We accept it when we confirm it, and we may decline or cancel an order, for example if an item is out of stock. Orders on a sale price are limited to available stock.",
        ],
      },
      {
        heading: "Payment",
        paragraphs: [
          "Payment is due as described for the method you choose at checkout. Orders paid by bank transfer are processed once the payment is confirmed.",
        ],
      },
      {
        heading: "Delivery and returns",
        paragraphs: [
          "Delivery times and fees, and how returns work, are set out in our Shipping & Returns policy, which forms part of these terms.",
        ],
      },
      {
        heading: "Your account",
        paragraphs: [
          "Keep your password confidential. You are responsible for activity on your account.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The {name} name, logo, images and designs belong to us. Please do not copy or reuse them without written permission.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "To the extent the law allows, we are not liable for indirect or consequential loss. Nothing in these terms limits your statutory consumer rights.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of the Federal Republic of Nigeria.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          "We may update these terms from time to time. Questions? Email {email}.",
        ],
      },
    ],
  },

  shipping: {
    title: "Shipping & Returns",
    updated: "16 November 2026",
    draft: true,
    intro:
      "How delivery works, what it costs, and how to return or exchange an item.",
    sections: [
      {
        heading: "Delivery zones and fees",
        type: "zones",
        paragraphs: [
          "We deliver across Nigeria. Your fee depends on your state, and you will see the exact amount at checkout once you choose it.",
        ],
      },
      {
        heading: "Free delivery",
        paragraphs: [
          "Orders of {threshold} or more qualify for free delivery.",
        ],
      },
      {
        heading: "Processing",
        paragraphs: [
          "Orders are prepared after they are confirmed. Delivery times above are in working days, counted from dispatch, and are estimates rather than guarantees.",
        ],
      },
      {
        heading: "When your order arrives",
        paragraphs: [
          "Please keep your phone on so our rider can reach you. Check your order on delivery and tell us straight away if anything is wrong.",
        ],
      },
      {
        heading: "Returns",
        paragraphs: [
          "If you are not happy, you can return eligible items within 7 days of delivery, provided they are:",
        ],
        list: [
          "Unworn, unwashed and in their original condition",
          "Complete with all tags attached",
          "Not marked as final sale",
        ],
      },
      {
        heading: "How to start a return",
        paragraphs: [
          "Email {email} with your order number and the item you want to return. We will confirm the next steps. The cost of returning an item is your responsibility unless it arrived faulty or incorrect.",
        ],
      },
      {
        heading: "Refunds and exchanges",
        paragraphs: [
          "Once we receive and check a returned item we will refund it to your original payment method, or exchange it for another size or colour if stock allows. Delivery fees are not refunded unless the return is due to our error.",
        ],
      },
      {
        heading: "Faulty or incorrect items",
        paragraphs: [
          "If something arrives damaged, faulty or not what you ordered, contact us within 48 hours of delivery with photos at {email} and we will make it right.",
        ],
      },
    ],
  },
};
