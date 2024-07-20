const extractDate = (datetime) => {
  const date = new Date(datetime);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTypeFormatted = (str) => {
  let type = 'Viewer';
  switch (str) {
    case 'player':
      type = 'Player/Individual'
      break;
    case 'team':
      type = 'Team/Club'
      break;
    case 'orgs':
      type = 'Organization'
      break;
    case 'other':
      type = 'Other Personalities'
      break;
    default:
      break;
  }
  return type;
}


export {extractDate, getTypeFormatted}
