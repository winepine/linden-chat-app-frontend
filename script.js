let uid1 = 125,
  uid2 = 123;
const fetchMessages = async () => {
  const response = await fetch(
    `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/messages?uid1=${uid1}&uid2=${uid2}`
  );
  const data = await response.json();
  console.log(data);
};
