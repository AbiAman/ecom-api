const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const nodemailer = require("nodemailer");

const authRoute = require("./Routes/authRoute");
const productRoute = require("./Routes/productRoute");
const blogRoute = require("./Routes/blogRoute");
const categoryRoute = require("./Routes/productCategoryRoute");
const blogCatRoute = require("./Routes/blogCatRoute");
const brandRoute = require("./Routes/brandRoute");
const couponRoute = require("./Routes/couponRoute");
const colorRoute = require("./Routes/colorRoute");
const enqRoute = require("./Routes/enqRoute");
const uploadRoute = require("./Routes/uploadRoute");
const uploadSeller = require("./Routes/sellerRoute");
const cors = require("cors");

const morgan = require("morgan");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

dbConnect();
const asyncHandler = require("express-async-handler");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
//app.use(cors());

app.use("/api/user", authRoute);
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/blogcategory", blogCatRoute);
app.use("/api/brand", brandRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquriy", enqRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/seller", uploadSeller);

app.use("/api/coupon", couponRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
