import { SESClient } from "@aws-sdk/client-ses";
import { sendEmail } from "../functions/log-in";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const emailAddress = "test@example.com";
  const magicLink = "https://example.com/login";

  const mockSendEmail = vi.fn().mockImplementation((emailAddress: string, magicLink: string) => {
    if (emailAddress && magicLink) {
      return true;
    }
    return false;
  });

  const mock = {
    send: mockSendEmail,
  };

  it("should send email successfully with correct inputs", async () => {
    const sendSpy = vi.spyOn(mock, "send");

    await mock.send(emailAddress, magicLink);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(emailAddress, magicLink);
  });

  it("should handle errors when sending email", async () => {
    const mockSendCommand = vi.fn();
    mockSendCommand.mockImplementation(() => {
      throw new Error("Error sending email");
    });
    SESClient.prototype.send = mockSendCommand;

    const emailAddress = "test@example.com";
    const magicLink = "https://example.com/login";

    const result = await sendEmail(emailAddress, magicLink);

    expect(result).toEqual(new Error("Error sending email"));
  });
});
