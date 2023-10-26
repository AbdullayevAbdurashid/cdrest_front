import dayjs from "dayjs";

export function getMessages(chat: any) {
  const { messages, currentChat } = chat;
  if (!currentChat) return [];
  const groups = messages
    .filter((item: any) => item.chat_id === currentChat.id)
    .reduce((groups: any, item: any) => {
      const date = dayjs(new Date(item.created_at)).format("MM-DD-YYYY");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      messages: groups[date],
    };
  });
  return groupArrays;
}
