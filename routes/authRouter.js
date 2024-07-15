const router = require("express").Router();
const passport = require("passport");
const passportConfig = require("../passport");
const models = require("../models");
const math = require("mathjs");
const bcrypt = require("bcrypt");
passportConfig();
const mailer = require("nodemailer");
const smtpTransport = mailer.createTransport({
  pool: true,
  maxConnections: 1,
  service: "naver",
  host: "smtp.naver.com",
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
  req.logout();
  req.session.destroy(() => {
    if (err) {
      return res.status(500).json({ message: "서버에러 발생", error: err });
    }
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
router.post("/api/join/verifyEmail", (req, res) => {
  if (!req.session.isJoinEmailChecked)
    return res.send({ message: "notCheckedEmail" });
  const { email } = req.body;
  const randNum = math.randomInt(100000, 999999);
  req.session.joinCode = randNum;

  const mailOption = {
    from: process.env.MAILER_USER,
    to: email,
    subject: "인증번호 발송",
    text: `<h1>인증번호 : ${randNum}<h1>`,
  };

  console.log("Sending email to:", email); // 디버깅 로그 추가

  smtpTransport.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log('err : ', error.message)
      res.send({ message: "fail" });
      smtpTransport.close();
      return;
    } else {
      res.send({ message: "success", joinCode: randNum });
      smtpTransport.close();
      return;
    }
  });
  return res.send({ message: "success", joinCode: randNum });
});

/** 인증번호 확인 */
router.post("/api/join/checkJoinCode", async (req, res) => {
  if (!req.session.isJoinEmailChecked)
    return res.send({ message: "notCheckedEmail" });
  const { code } = req.body;
  console.log(code)
  if (code == req.session.joinCode) {
    req.session.isJoinEmailVerified = true;
    return res.send({ message: "success" });
  } else {
    delete req.session.isJoinEmailVerified;
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
    profileImage:
      process.env.PORTIMAGE + `/uploads/profileImages/defaultProfileImage.png`,
  };

  result = await models.User.create(data);
  delete req.session.isJoinEmailChecked;
  delete req.session.isJoinEmailVerified;
  delete req.session.isJoinNicknameChecked;
  return res.send({ message: "success" });
});

module.exports = router;
