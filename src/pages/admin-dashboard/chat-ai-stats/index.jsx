import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ChatAiStatsView } from 'src/sections/_active/chat-ai-stats-view';

// ----------------------------------------------------------------------

const metadata = { title: `Chat AI Stats | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChatAiStatsView />
    </>
  );
}
