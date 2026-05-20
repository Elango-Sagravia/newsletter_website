export const metadata = {
  title: "House of Summary",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UpdatePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "24px",
            lineHeight: "1.2",
          }}
        >
          House of Summary is in the process of being acquired
        </h1>

        <p
          style={{
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#555",
          }}
        >
          We thank all our 10 million subscribers.
          <br />
          <br />
          If you want to unsubscribe from any of our newsletters, please email{" "}
          <a
            href="mailto:houseofsummary@gmail.com"
            style={{
              color: "#000",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            houseofsummary@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
