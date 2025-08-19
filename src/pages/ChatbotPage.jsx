s/layouts/NoNavLayout";

export default function ChatbotPage() {
  return (
    <NoNavLayout>
      <div className="min-h-full bg-bg-blue">
        <Header/>
        <div className="pt-12">
          <ChatThread/>
        </div>
      </div>
    </NoNavLayout>
  );
}
