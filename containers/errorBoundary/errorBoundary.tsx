import React, { Component } from "react";
import cls from "./errorBoundary.module.scss";
import { BrandLogo, BrandLogoDark } from "components/icons";
import DarkButton from "components/button/darkButton";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  isDarkMode: boolean;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={cls.wrapper}>
          <div className={cls.header}>
            <Link
              href="/"
              style={{ display: "block" }}
              onClick={() => this.setState({ hasError: false })}
            >
              {this.props.isDarkMode ? <BrandLogoDark /> : <BrandLogo />}
            </Link>
          </div>
          <div className={cls.body}>
            <h1>Oops, something went wrong!</h1>
            <DarkButton
              type="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </DarkButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
