require("dotenv").config();
const router = require("express").Router();
const models = require("../models");

/** 그룹찾기 */
router.get("/api/groupChatRoom", async (req, res) => {
  try {
    const result = await models.GroupChatRoom.findAll();
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* 그룹 생성
 * 한 유저에 방은 두개까지 개설 가능 등급 오를 시 개수 추가 및 인원 증가
 *  초기 인원 bronze : 10명 silver : 15명 gold : 20명
 *  방 개수  bronze : 2개 , silver : 3개 , gold : 4개
 */
router.post("/api/groupChatRoom/post", async (req, res) => {
  try {
    const result = await models.GroupChatRoom.create({
      readerId: req.body.readerId,
      title: req.body.title,
      content : req.body.content,
      anonymous: req.body.anonymous,
      profileImage: req.body.profileImage || process.env.PORTIMAGE + `/uploads/profileImages/defaultProfileImage.png`,
      members: req.body.members,
    });
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
