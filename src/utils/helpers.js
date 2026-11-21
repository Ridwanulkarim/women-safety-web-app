const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliDigits = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
};

export const localizeNum = (value, isBn = false) => {
  if (value === null || value === undefined) return '';
  return isBn ? toBengaliDigits(value) : String(value);
};

export const formatDate = (dateString, isBn = false) => {
  if (!dateString) return isBn ? 'প্রযোজ্য নয়' : 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formatted = new Date(dateString).toLocaleDateString(isBn ? 'bn-BD' : undefined, options);
  return isBn ? toBengaliDigits(formatted) : formatted;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
