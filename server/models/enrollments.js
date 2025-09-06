const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Enrollment = sequelize.define(
  'Enrollment',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    enrollment_date: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'enrollments'
  }
)

module.exports = Enrollment
