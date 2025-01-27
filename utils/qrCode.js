const QRCode = require('qrcode');

exports.generateQRCode = async (hotelId) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Dynamic base URL
    const hotelUrl = `${baseUrl}/guest/hotel/${hotelId}`;
    try {
        const qrCode = await QRCode.toDataURL(hotelUrl);
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

module.exports = generateQRCode;