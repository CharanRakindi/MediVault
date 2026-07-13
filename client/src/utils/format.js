export function formatDoctorName(name) {
  if (!name) return 'Dr. Staff';
  
  let clean = name.trim();
  
  // Strip out "dr.", "dr", "Dr.", "Dr", "dr. ", etc. from the start
  // Loop to catch multiple nested prefixes
  while (/^(dr\.?)\s+/i.test(clean)) {
    clean = clean.replace(/^(dr\.?)\s+/i, '').trim();
  }
  
  // Prepend exactly "Dr. "
  return `Dr. ${clean}`;
}
