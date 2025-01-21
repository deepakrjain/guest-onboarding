const generateQRCode = async (hotelId) => {
    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const url = `${baseUrl}/guest/form/${hotelId}`;
        return await QRCode.toDataURL(url);
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw error;
    }
};

module.exports = generateQRCode;