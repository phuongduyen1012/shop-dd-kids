/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const Enrollment = require('../models/enrollments')
const User = require('../models/user')
const Course = require('../models/product')

const generateUserId = async () => {
  const users = await User.findAll()
  const userIds = users.map(user => user.id)
  const randomIndex = Math.floor(Math.random() * userIds.length)
  const randomUserId = userIds[randomIndex]
  return randomUserId
}

const generateCourseId = async () => {
  const courses = await Course.findAll()
  const courseIds = courses.map(course => course.id)
  const randomIndex = Math.floor(Math.random() * courseIds.length)
  const randomCourseId = courseIds[randomIndex]
  return randomCourseId
}

const generateEnrollment = async () => {
  const usedPairs = new Set()
  const enrollments = []

  while (enrollments.length < 10) {
    const userId = await generateUserId()
    const courseId = await generateCourseId()
    const pair = `${userId}-${courseId}`

    if (!usedPairs.has(pair)) {
      usedPairs.add(pair)
      const enrollment_date = faker.date.past()
      enrollments.push({
        userId,
        courseId,
        enrollment_date,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
    }
  }
  return enrollments
}

const seedEnrollment = async () => {
  try {
    const count = await Enrollment.count()
    if (count === 0) {
      const enrollments = await generateEnrollment()
      await Enrollment.bulkCreate(enrollments, { validate: true })
    } else {
      console.log('Enrollment table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Enrollment data: ${error}`)
  }
}

module.exports = seedEnrollment
