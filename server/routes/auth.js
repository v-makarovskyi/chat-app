const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//регистрация
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //создаем нового пользователя
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //сохраняем пользователя в БД
    const user = await newUser.save();
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
