import axios from 'axios';

export async function sendWhatsAppReminder(billId: string, phone: string, amount: number) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneBaseId = process.env.WHATSAPP_PHONE_BASE_ID;

  if (!token || !phoneBaseId) {
    throw new Error("Configurações de WhatsApp (Token/ID) não encontradas no servidor.");
  }

  try {
    console.log(`[WhatsApp] Enviando lembrete para ${phone} via Cloud API ID: ${phoneBaseId}`);
    
    await axios.post(
      `https://graph.facebook.com/v19.0/${phoneBaseId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: `Olá! Temos uma fatura pendente de R$ ${amount.toFixed(2)}. ID: ${billId}. Por favor, realize o pagamento.`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, message: "Lembrete enviado com sucesso via WhatsApp API." };
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw new Error("Falha ao enviar mensagem WhatsApp.");
  }
}

export async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneBaseId = process.env.WHATSAPP_PHONE_BASE_ID;

  if (!token || !phoneBaseId) {
    throw new Error("Configurações de WhatsApp (Token/ID) não encontradas no servidor.");
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${phoneBaseId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw new Error("Falha ao enviar mensagem WhatsApp.");
  }
}
