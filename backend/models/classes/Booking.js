module.exports = class Booking {
  constructor (propertyId, propertyName, city, user, checkinDate, checkoutDate, numberOfRooms) {
    this.property_id = propertyId
    this.property_name = propertyName
    this.city = city
    this.user = user
    this.checkin_date = checkinDate
    this.checkout_date = checkoutDate
    this.number_of_rooms = numberOfRooms
  }
}
