import ConversationDetail from '@/components/conversations/ConversationDetail';

const ConversationDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ConversationDetail id={id} />;
};
export default ConversationDetailPage;
