import ChatAvatar from "../../assets/chatbot/chatAvatar.svg?react";

export default function Chat({ role, message }) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="w-full flex justify-end">
        <div className="max-w-3/4 bg-chat py-2 px-3 rounded-2xl rounded-br-[4px] ">
          <span className="text-body-02-regular text-white ">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3/4 flex justify-start">
      <div className="flex">
        <ChatAvatar/>
        <div className="flex flex-col gap-1">
          <span className="text-detail-01-regular leading-[100%] ">아끼미</span>
          <div className="max-w-3/4 bg-white py-2 px-3 rounded-2xl rounded-bl-[4px] ">
            <span className="text-body-02-regular text-gray-100 ">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}