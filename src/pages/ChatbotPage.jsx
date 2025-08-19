import ChatThread from "../components/chatbot/chatThread";
import Header from "../components/chatbot/Header";
import NoNavLayout from "../components/layouts/NoNavLayout";

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
