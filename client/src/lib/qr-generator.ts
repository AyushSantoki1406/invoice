import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export const generateUPIQRCode = async (
  upiId: string,
  payeeName: string,
  amount: number,
  currency = 'INR'
): Promise<string> => {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}`;
  return generateQRCode(upiString);
};
