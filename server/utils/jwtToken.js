const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        samesite: 'none',
    }
   const hat =  res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

    console.log(hat)

    
  
  }
  
  module.exports = sendToken;
  