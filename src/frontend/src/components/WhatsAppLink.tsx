import { MessageCircle } from 'lucide-react';
import { createWhatsAppLink, isPhoneNumber } from '@/lib/whatsapp';

interface WhatsAppLinkProps {
  contact: string;
  className?: string;
  showIcon?: boolean;
}

export default function WhatsAppLink({ contact, className = '', showIcon = true }: WhatsAppLinkProps) {
  // Check if the contact looks like a phone number
  if (!isPhoneNumber(contact)) {
    // If not a phone number, display as plain text
    return <span className={className}>{contact}</span>;
  }

  const whatsappUrl = createWhatsAppLink(contact);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-umkm-blue hover:text-umkm-blue/80 hover:underline transition-colors ${className}`}
    >
      {showIcon && <MessageCircle className="h-4 w-4" />}
      <span>Mulai Chat</span>
    </a>
  );
}
