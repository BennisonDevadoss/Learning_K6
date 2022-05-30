k6 run signin.mjs

sleep 7

node readOtp.js # Here this node file reads the otp from the users email.

./k6 run verifyOtp.mjs

node readToken.mjs