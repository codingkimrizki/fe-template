export const getRoleColor = role => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '#5D866C'
    case 'staff':
      return '#EDA35A'
    case 'user':
      return '#789DBC'
    default:
      return '#789DBC'
  }
}
