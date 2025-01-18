const QRCode = require('qrcode');

const generateQRCode = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        throw error;
    }
};

module.exports = generateQRCode;