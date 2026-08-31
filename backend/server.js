require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require("https");

const app = express();
const PORT = 5000;

// =====================================================
// MONGODB CONNECTION
// =====================================================

const client = new MongoClient(process.env.MONGO_URI);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login.",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, user) => {
      if (error) {
        return res.status(403).json({
          message: "Invalid or expired token.",
        });
      }

      req.user = user;
      next();
    }
  );
}

// =====================================================
// TEST API
// =====================================================

app.get("/api/test", (req, res) => {
  res.json({
    message: "CareerPilot backend is working!",
  });
});

// =====================================================
// SIGNUP API
// =====================================================

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const db = client.db("CareerPilot");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,

      // Profile
      college: "",
      degree: "",
      skills: "",
      careerGoal: "Software Developer",
      experience: "Fresher",

      // DSA
      dsa: {
  topicCompletion: {},
},

roadmap: {
  stepCompletion: {
    "1": true,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  },
},

leetcodeUsername: "",

      // LeetCode
      leetcodeUsername: "",

      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Signup successful!",
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message:
        "Something went wrong while creating the account.",
    });
  }
});

// =====================================================
// LOGIN API
// =====================================================

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const db = client.db("CareerPilot");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful!",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message:
        "Something went wrong while logging in.",
    });
  }
});

// =====================================================
// GET PROFILE API
// =====================================================

app.get(
  "/api/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const db = client.db("CareerPilot");
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne(
        {
          _id: new ObjectId(req.user.userId),
        },
        {
          projection: {
            password: 0,
          },
        }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      res.json({
        profile: user,
      });
    } catch (error) {
      console.error(
        "Get profile error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching profile.",
      });
    }
  }
);

// =====================================================
// UPDATE PROFILE API
// =====================================================

app.put(
  "/api/profile",
  authenticateToken,
  async (req, res) => {
    const {
      name,
      email,
      college,
      degree,
      skills,
      careerGoal,
      experience,
    } = req.body;

    try {
      if (!name || !email) {
        return res.status(400).json({
          message: "Name and email are required.",
        });
      }

      const db = client.db("CareerPilot");
      const usersCollection = db.collection("users");

      const userId = new ObjectId(
        req.user.userId
      );

      const existingUser =
        await usersCollection.findOne({
          email,
          _id: {
            $ne: userId,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "This email is already being used by another account.",
        });
      }

      await usersCollection.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            name,
            email,
            college: college || "",
            degree: degree || "",
            skills: skills || "",
            careerGoal:
              careerGoal || "Software Developer",
            experience:
              experience || "Fresher",
          },
        }
      );

      const updatedUser =
        await usersCollection.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              password: 0,
            },
          }
        );

      res.json({
        message:
          "Profile updated successfully.",
        profile: updatedUser,
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while updating profile.",
      });
    }
  }
);

// =====================================================
// GET LEETCODE USERNAME
// =====================================================

app.get(
  "/api/leetcode",
  authenticateToken,
  async (req, res) => {
    try {
      const db = client.db("CareerPilot");
      const usersCollection =
        db.collection("users");

      const user =
        await usersCollection.findOne(
          {
            _id: new ObjectId(
              req.user.userId
            ),
          },
          {
            projection: {
              leetcodeUsername: 1,
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      res.json({
        leetcodeUsername:
          user.leetcodeUsername || "",
      });
    } catch (error) {
      console.error(
        "Get LeetCode username error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching LeetCode username.",
      });
    }
  }
);

// =====================================================
// SAVE LEETCODE USERNAME
// =====================================================

app.put(
  "/api/leetcode",
  authenticateToken,
  async (req, res) => {
    const { leetcodeUsername } = req.body;

    if (
      !leetcodeUsername ||
      !leetcodeUsername.trim()
    ) {
      return res.status(400).json({
        message:
          "Please enter a LeetCode username.",
      });
    }

    try {
      const db = client.db("CareerPilot");
      const usersCollection =
        db.collection("users");

      await usersCollection.updateOne(
        {
          _id: new ObjectId(
            req.user.userId
          ),
        },
        {
          $set: {
            leetcodeUsername:
              leetcodeUsername.trim(),
          },
        }
      );

      res.json({
        message:
          "LeetCode username saved successfully.",

        leetcodeUsername:
          leetcodeUsername.trim(),
      });
    } catch (error) {
      console.error(
        "Save LeetCode username error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while saving LeetCode username.",
      });
    }
  }
);

// =====================================================
// DISCONNECT LEETCODE
// =====================================================

app.delete(
  "/api/leetcode",
  authenticateToken,
  async (req, res) => {
    try {
      const db = client.db("CareerPilot");
      const usersCollection =
        db.collection("users");

      await usersCollection.updateOne(
        {
          _id: new ObjectId(
            req.user.userId
          ),
        },
        {
          $unset: {
            leetcodeUsername: "",
          },
        }
      );

      res.json({
        message:
          "LeetCode profile disconnected successfully.",
      });
    } catch (error) {
      console.error(
        "Disconnect LeetCode error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while disconnecting LeetCode.",
      });
    }
  }
);

// =====================================================
// GET LEETCODE USER STATISTICS
// =====================================================

app.get(
  "/api/leetcode/stats",
  authenticateToken,
  async (req, res) => {
    try {
      const db = client.db("CareerPilot");
      const usersCollection =
        db.collection("users");

      // -----------------------------------------------
      // FIND USER
      // -----------------------------------------------

      const user =
        await usersCollection.findOne(
          {
            _id: new ObjectId(
              req.user.userId
            ),
          },
          {
            projection: {
              leetcodeUsername: 1,
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      if (!user.leetcodeUsername) {
        return res.status(400).json({
          message:
            "Please connect your LeetCode profile first.",
        });
      }

      const username =
        user.leetcodeUsername;

      // -----------------------------------------------
      // LEETCODE GRAPHQL QUERY
      // -----------------------------------------------

      const query = `
        query getUserStats($username: String!) {

          allQuestionsCount {
            difficulty
            count
          }

          matchedUser(username: $username) {

            username

            profile {
              ranking
            }

            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      const requestBody =
        JSON.stringify({
          query,
          variables: {
            username,
          },
        });

      // -----------------------------------------------
      // LEETCODE REQUEST OPTIONS
      // -----------------------------------------------

      const options = {
        hostname: "leetcode.com",
        path: "/graphql/",
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Content-Length":
            Buffer.byteLength(
              requestBody
            ),

          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",

          "Accept":
            "application/json",

          "Origin":
            "https://leetcode.com",

          "Referer":
            "https://leetcode.com/",
        },
      };

      // -----------------------------------------------
      // SEND REQUEST
      // -----------------------------------------------

      const leetcodeRequest =
        https.request(
          options,
          (leetcodeResponse) => {

            let data = "";

            leetcodeResponse.on(
              "data",
              (chunk) => {
                data += chunk;
              }
            );

            leetcodeResponse.on(
              "end",
              () => {

                try {

                  console.log(
                    "LeetCode HTTP Status:",
                    leetcodeResponse.statusCode
                  );

                  console.log(
                    "LeetCode Response:",
                    data.substring(0, 2000)
                  );

                  const result =
                    JSON.parse(data);

                  // -----------------------------------------
                  // GRAPHQL ERROR
                  // -----------------------------------------

                  if (result.errors) {

                    console.error(
                      "LeetCode GraphQL errors:",
                      JSON.stringify(
                        result.errors,
                        null,
                        2
                      )
                    );

                    return res.status(500).json({
                      message:
                        "LeetCode API returned an error.",
                      details:
                        result.errors[0]
                          ?.message ||
                        "Unknown LeetCode error.",
                    });
                  }

                  // -----------------------------------------
                  // CHECK USER
                  // -----------------------------------------

                  if (
                    !result.data ||
                    !result.data.matchedUser
                  ) {

                    return res.status(404).json({
                      message:
                        "LeetCode username not found.",
                    });

                  }

                  const matchedUser =
                    result.data.matchedUser;

                  // -----------------------------------------
                  // SOLVED PROBLEMS
                  // -----------------------------------------

                  const submissions =
                    matchedUser
                      .submitStats
                      ?.acSubmissionNum ||
                    [];

                  let totalSolved = 0;
                  let easySolved = 0;
                  let mediumSolved = 0;
                  let hardSolved = 0;

                  submissions.forEach(
                    (item) => {

                      const count =
                        Number(item.count) || 0;

                      if (
                        item.difficulty ===
                        "All"
                      ) {
                        totalSolved = count;
                      }

                      if (
                        item.difficulty ===
                        "Easy"
                      ) {
                        easySolved = count;
                      }

                      if (
                        item.difficulty ===
                        "Medium"
                      ) {
                        mediumSolved = count;
                      }

                      if (
                        item.difficulty ===
                        "Hard"
                      ) {
                        hardSolved = count;
                      }
                    }
                  );

                  // -----------------------------------------
                  // TOTAL QUESTIONS
                  // -----------------------------------------

                  const questionCounts =
                    result.data
                      .allQuestionsCount ||
                    [];

                  let totalQuestions = 0;
                  let easyQuestions = 0;
                  let mediumQuestions = 0;
                  let hardQuestions = 0;

                  questionCounts.forEach(
                    (item) => {

                      const count =
                        Number(item.count) || 0;

                      if (
                        item.difficulty ===
                        "All"
                      ) {
                        totalQuestions =
                          count;
                      }

                      if (
                        item.difficulty ===
                        "Easy"
                      ) {
                        easyQuestions =
                          count;
                      }

                      if (
                        item.difficulty ===
                        "Medium"
                      ) {
                        mediumQuestions =
                          count;
                      }

                      if (
                        item.difficulty ===
                        "Hard"
                      ) {
                        hardQuestions =
                          count;
                      }
                    }
                  );

                  // -----------------------------------------
                  // FALLBACK TOTAL
                  // -----------------------------------------

                  if (
                    totalQuestions === 0
                  ) {
                    totalQuestions =
                      easyQuestions +
                      mediumQuestions +
                      hardQuestions;
                  }

                  // -----------------------------------------
                  // SEND DATA TO FRONTEND
                  // -----------------------------------------

                  res.json({

                    username:
                      matchedUser.username,

                    // SOLVED
                    totalSolved,
                    easySolved,
                    mediumSolved,
                    hardSolved,

                    // AVAILABLE QUESTIONS
                    totalQuestions,
                    easyQuestions,
                    mediumQuestions,
                    hardQuestions,

                    // RANK
                    ranking:
                      matchedUser
                        .profile
                        ?.ranking ||
                      null,
                  });

                } catch (error) {

                  console.error(
                    "LeetCode response parsing error:",
                    error
                  );

                  if (
                    !res.headersSent
                  ) {
                    res.status(500).json({
                      message:
                        "Unable to process LeetCode statistics.",
                    });
                  }

                }
              }
            );
          }
        );

      // -----------------------------------------------
      // REQUEST ERROR
      // -----------------------------------------------

      leetcodeRequest.on(
        "error",
        (error) => {

          console.error(
            "LeetCode request error:",
            error
          );

          if (!res.headersSent) {

            res.status(500).json({
              message:
                "Unable to connect to LeetCode.",
            });

          }
        }
      );

      leetcodeRequest.write(
        requestBody
      );

      leetcodeRequest.end();

    } catch (error) {

      console.error(
        "LeetCode stats error:",
        error
      );

      if (!res.headersSent) {

        res.status(500).json({
          message:
            "Something went wrong while fetching LeetCode statistics.",
        });

      }
    }
  }
);

// =====================================================
// GET DSA DATA
// =====================================================

app.get(
  "/api/dsa",
  authenticateToken,
  async (req, res) => {

    try {

      const db = client.db("CareerPilot");

      const usersCollection =
        db.collection("users");

      const user =
        await usersCollection.findOne(
          {
            _id: new ObjectId(
              req.user.userId
            ),
          },
          {
            projection: {
              dsa: 1,
            },
          }
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found.",
        });

      }

      res.json({

        dsa:
          user.dsa || {
            topicCompletion: {},
          },

      });

    } catch (error) {

      console.error(
        "Get DSA error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while fetching DSA data.",
      });

    }
  }
);

// =====================================================
// UPDATE DSA TOPIC COMPLETION
// =====================================================

app.put(
  "/api/dsa/topic",
  authenticateToken,
  async (req, res) => {

    const {
      topicId,
      completed,
    } = req.body;

    try {

      if (
        topicId === undefined ||
        completed === undefined
      ) {

        return res.status(400).json({
          message:
            "Topic ID and completion status are required.",
        });

      }

      const db =
        client.db("CareerPilot");

      const usersCollection =
        db.collection("users");

      const userId =
        new ObjectId(
          req.user.userId
        );

      await usersCollection.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            [`dsa.topicCompletion.${topicId}`]:
              Boolean(completed),
          },
        }
      );

      const updatedUser =
        await usersCollection.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              dsa: 1,
            },
          }
        );

      res.json({

        message:
          "Topic completion updated successfully.",

        topicCompletion:
          updatedUser
            ?.dsa
            ?.topicCompletion ||
          {},

      });

    } catch (error) {

      console.error(
        "Update DSA topic error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while updating DSA topic.",
      });

    }
  }
);
// =====================================================
// GET ROADMAP DATA
// =====================================================

app.get(
  "/api/roadmap",
  authenticateToken,
  async (req, res) => {
    try {
      const db = client.db("CareerPilot");
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne(
        {
          _id: new ObjectId(req.user.userId),
        },
        {
          projection: {
            roadmap: 1,
          },
        }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      res.json({
        roadmap: user.roadmap || {
          stepCompletion: {
            "1": true,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
          },
        },
      });
    } catch (error) {
      console.error("Get roadmap error:", error);

      res.status(500).json({
        message:
          "Something went wrong while fetching roadmap data.",
      });
    }
  }
);

// =====================================================
// UPDATE ROADMAP STEP
// =====================================================

app.put(
  "/api/roadmap/step",
  authenticateToken,
  async (req, res) => {
    const { stepId, completed } = req.body;

    try {
      if (
        stepId === undefined ||
        completed === undefined
      ) {
        return res.status(400).json({
          message:
            "Step ID and completion status are required.",
        });
      }

      const db = client.db("CareerPilot");
      const usersCollection = db.collection("users");

      const userId = new ObjectId(
        req.user.userId
      );

      await usersCollection.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            [`roadmap.stepCompletion.${stepId}`]:
              Boolean(completed),
          },
        }
      );

      const updatedUser =
        await usersCollection.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              roadmap: 1,
            },
          }
        );

      res.json({
        message:
          "Roadmap progress updated successfully.",

        roadmap:
          updatedUser?.roadmap || {
            stepCompletion: {},
          },
      });
    } catch (error) {
      console.error(
        "Update roadmap step error:",
        error
      );

      res.status(500).json({
        message:
          "Something went wrong while updating roadmap.",
      });
    }
  }
);

// =====================================================
// CONNECT TO MONGODB
// =====================================================

async function connectDB() {

  try {

    await client.connect();

    console.log(
      "MongoDB connected successfully!"
    );

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error
    );

  }

}

connectDB();

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {

    console.log(
      `CareerPilot backend running on port ${PORT}`
    );

  }
);