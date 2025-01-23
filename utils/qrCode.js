const QRCode = require('qrcode');

exports.generateQRCode = async (hotelId) => {
    const baseUrl = 'http://192.168.29.1:3000'; // Replace with your LAN IP for testing on mobile
    const hotelUrl = `${baseUrl}/guest/hotel/${hotelId}`; // Hotel landing page
    try {
        const qrCode = await QRCode.toDataURL(hotelUrl);
        return qrCode; // Return base64 QR code string
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

module.exports = generateQRCode;