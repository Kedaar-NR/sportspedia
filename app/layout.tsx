export const metadata = {
  title: "Sportspedia",
  description: "Sports-focused Wikipedia landing with teams and players",
};

// Inlined global styles to avoid CSS parsing issues in some environments

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --text: #202122;
            --muted: #54595d;
            --blue: #3366cc;
             --border: #e5e7eb;
             --bg: #fbfbfd;
             --card-bg: #ffffff;
             --shadow: 0 1px 2px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.06);
          }
          * {
            box-sizing: border-box;
          }
          html,
          body {
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto,
              Helvetica, Arial;
          }
          .container {
             max-width: 1040px;
            margin: 0 auto;
             padding: 28px 16px 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .title {
            font-family: "Linux Libertine", Georgia, serif;
            font-weight: 700;
             font-size: 40px;
            margin: 0;
          }
          .subtitle {
            margin: 0;
            color: var(--muted);
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
             gap: 18px;
            width: 100%;
            margin-top: 12px;
          }
          .card {
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-decoration: none;
             border: 1px solid var(--border);
             border-radius: 12px;
             padding: 14px 16px;
             background: var(--card-bg);
             box-shadow: var(--shadow);
          }
          .card:hover {
             transform: translateY(-1px);
             background: #ffffff;
          }
          .cardTitle {
            color: var(--blue);
            font-weight: 600;
          }
          .cardMeta {
            color: var(--muted);
            font-size: 12px;
          }
          @media (max-width: 900px) {
            .grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 560px) {
            .grid {
              grid-template-columns: 1fr;
            }
            .title {
              font-size: 36px;
            }
          }
            .list {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px 16px;
              width: 100%;
            }
            .item {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
            border: 1px solid var(--border);
             border-radius: 10px;
              padding: 12px 14px;
             background: var(--card-bg);
             box-shadow: var(--shadow);
          }
          .row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .thumb {
             width: 34px;
             height: 34px;
             border-radius: 6px;
             object-fit: contain;
             background: #f6f7f9;
             border: 1px solid #e5e7eb;
          }
          .manager {
            background: #fff7e6;
            border-color: #f5c26b;
          }
          .btnRow {
            display: flex;
            gap: 8px;
            align-self: flex-start;
          }
          .list .item .cardTitle a {
            color: var(--blue);
            text-decoration: none;
          }
          .searchRow {
            display: flex;
            gap: 8px;
            width: 100%;
            max-width: 600px;
          }
          .searchInput {
            flex: 1;
            border: 1px solid var(--border);
             border-radius: 10px;
             padding: 12px 12px;
          }
          .searchBtn {
            border: 1px solid var(--border);
             border-radius: 10px;
             background: #f3f4f6;
             padding: 12px 14px;
            cursor: pointer;
          }
          @media (max-width: 700px) {
            .list {
              grid-template-columns: 1fr;
            }
          }
           @media (prefers-color-scheme: dark) {
             :root { --text:#e5e7eb; --muted:#9aa0a6; --bg:#0e1117; --card-bg:#111827; --border:#243042; --blue:#8ab4f8; }
             .card:hover{ background:#0f172a; }
             .thumb{ background:#0f172a; border-color:#243042; }
           }
        `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
