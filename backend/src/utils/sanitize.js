const sanitizeText = (value) => value.replace(/[<>]/g, "").trim();

module.exports = { sanitizeText };
