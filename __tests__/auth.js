const mockRequest = (body, options) => ({
  body,
  options,
});

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const checkAndSignUp = (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      if (req.options && req.options.exists) {
        return res.status(409).json({
          success: false,
          msg: `User already exists with email ${req.body.email}`,
        });
      }

      return res.status(200).json({
        success: true,
        msg: "User registered",
      });
    }

    return res.status(409).json({
      success: false,
      msg: "You must provide the email and password",
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      msg: "Some error occurred while registering the user",
    });
  }
};

describe("Registration", () => {
  test("It should return 409 if email exists", async () => {
    const req = mockRequest(
      {
        email: "someone@something.com",
        password: "testpassword",
      },
      { exists: true }
    );
    const res = mockResponse();

    checkAndSignUp(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: `User already exists with email ${req.body.email}`,
    });
  });

  test("It should return 409 if email or password is not provided", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    checkAndSignUp(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "You must provide the email and password",
    });
  });

  test("It should return 200", async () => {
    const req = mockRequest({
      email: "someone@something.com",
      password: "testpassword",
    });
    const res = mockResponse();

    checkAndSignUp(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "User registered",
    });
  });
});
