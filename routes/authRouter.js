require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const passportConfig = require("../passport");
const models = require("../models");
const math = require("mathjs");
const bcrypt = require("bcrypt");
passportConfig();

const mailer = require("nodemailer");
const SMTPTransport = require("nodemailer/lib/smtp-transport");
const transport = mailer.createTransport({
  pool: true,
  maxConnections: 1,
  service: "naver",
  host: "hotcake1234@naver.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**로그인 api */
router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error)
      return res.status(500).json({ message: "서버 에러 발생", error });
    if (!user) return res.status(401).json({ message: "인증 실패", ...info });
    console.log(req.login);
    req.login(user, (error) => {
      if (error) return next(error);

      console.log("login success");
      const userInfo = {
        userId: req.user.userId,
        email: req.user.email,
        nickname: req.user.nickname,
        profileImage: req.user.profileImage,
        tier: req.user.tier,
        status: req.user.status,
        role: req.user.role,
      };

      return res.status(200).json({ message: "success", userInfo });
    });
  })(req, res);
});

/**로그아웃 */
router.get("/api/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    return res.send({ message: "success" });
  });
});

/**회원가입 - 이메일 중복 확인 */
router.post("/api/join/checkDuplicationEmail", async (req, res) => {
  const { email } = req.body;
  const result = await models.User.findOne({ where: { email } });
  if (result != null) {
    delete req.session.isJoinEmailChecked;
    return res.send({ message: "duplicated" });
  }
  req.session.isJoinEmailChecked = true;
  return res.send({ message: "success" });
});

/** 이메일 값 변경시 세션 삭제 */
router.get("/api/join/changedEmail", (req, res) => {
  delete req.session.isJoinEmailChecked;
  delete req.session.isJoinEmailVerified;
  return res.send({ message: "success" });
});

/**이메일 인증번호 발송 */
router.post("/api/join/verifyEmail", async (req, res) => {
  if (!req.session.isJoinEmailChecked)
    return res.send({ message: "notCheckedEmail" });
  const { email } = req.body;
  const randumNum = math.randomInt(100000, 999999);
  req.session.joinCode = randumNum;
  const mailOption = {
    from: "hotcake1234@naver.com",
    to: email,
    subject: "이메일 확인",
    text: `이메일 확인번호 : ${randumNum}`,
  };
  SMTPTransport.sendMail(mailOption, (error, info) => {
    if (error) {
      res.send({ message: "fail" });
      SMTPTransport.close();
      return;
    } else {
      res.send({ message: "success", joinCode: randumNum });
      SMTPTransport.close();
      return;
    }
  });
  return res.send({ message: "success", joinCode: randumNum });
});

/** 인증번호 확인 */
router.post("api/join/checkJoinCode", async (req, res) => {
  if (!req.session.isJoinEmailChecked)
    return res.send({ message: "notCheckedEmail" });
  const { joinCode } = req.body;
  if (joinCode == req.session.joinCode) {
    req.session.isJoinEmailVerified = true;
    return res.send({ message: "success" });
  } else {
    return res.send({ message: "fail" });
  }
});

/** 닉네임 중복 체크 */
router.post("/api/join/checkDuplicationNickname", async (req, res) => {
  const { nickname } = req.body;
  const result = await models.User.findOne({ where: { nickname } });
  if (result != null) {
    delete req.session.isJoinNicknameChecked;
    return res.send({ message: "duplicated" });
  }
  req.session.isJoinNicknameChecked = true;
  return res.send({ message: "success" });
});

// 닉네임 값 변경시 세션 삭제
router.get("/api/join/changedNickname", (req, res) => {
  delete req.session.isJoinNicknameChecked;
  return res.send({ message: "success" });
});

/** 회원가입 */
router.post("/api/join", async (req, res) => {
  const { email, nickname, password } = req.body;
  if (req.session.isJoinEmailChecked != true)
    return res.send({ message: "emailNotChecked" });
  if (req.session.isJoinEmailVerified != true)
    return res.send({ message: "emailNotVerified" });
  if (req.session.isJoinNicknameChecked != true)
    return res.send({ message: "nicknameNotChecked" });

  let result = await models.User.findOne({ where: { email } });
  if (result != null) return res.send({ message: "duplicated" });

  const data = {
    email,
    nickname,
    password: await bcrypt.hash(password, 10),
    status: "ok",
    role: "user",
    tier: "bronze",
    profileImage: `https://192.168.219.104:10000/uploads/profileImages/defaultProfileImage.png`,
  };

  result = await models.User.create(data);
  delete req.session.isJoinEmailChecked;
  delete req.session.isJoinEmailVerified;
  delete req.session.isJoinNicknameChecked;
  return res.send({ message: "success" });
});

module.exports = router;
