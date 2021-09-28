import React from "react";
import { waitFor } from "@testing-library/dom";

import { render, fireEvent } from "../tests/testUtils";
import { SIGNUP_MOCKS } from "../tests/__mocks__/api/signup.mock";
import { useMockRouter } from "../tests/useMockRouter";
import Signup from "./signup.page";

describe("Signup page", () => {
  it("should render", () => {
    useMockRouter({
      route: "/",
    });
    const { getByText } = render(<Signup />);
    expect(getByText("Sign up")).toBeVisible();
    expect(getByText("Continue with email")).toBeVisible();
  });

  it("should accept a user's email and request verification code", async () => {
    useMockRouter({
      route: "/login",
    });
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <Signup />,
      { mocks: SIGNUP_MOCKS }
    );
    const email = "test@hash.ai";
    const input = getByPlaceholderText("Enter your email address", {
      exact: false,
    });
    fireEvent.change(input, { target: { value: email } });
    fireEvent.submit(input);
    await waitFor(() => expect(SIGNUP_MOCKS[0].result).toHaveBeenCalled());
    expect(getByText(email, { exact: false })).toBeVisible();
    expect(getByTestId("verify-code-input")).toBeInTheDocument();
  });
});
