import Masonry from 'react-masonry-css';

import { AddQuoteModal } from '@/pages/quotes/AddQuoteModal.tsx';
import { useEffect, useState } from 'react';
import { QuoteQuery } from '@/query/QuoteQuery.ts';
import type { Quote } from '@/model/Quote.ts';
import { QuoteCard } from '@/pages/quotes/QuoteCard.tsx';

export const QuotesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    QuoteQuery.find({
      pageSize: 20,
    }).then(setQuotes);
  }, []);

  const refresh = () => {
    QuoteQuery.find({
      pageSize: 20,
    }).then(setQuotes);
  };

  return (
    <div className={'flex flex-col gap-8 px-4 mb-10 pb-[70px]'}>
      <header className={'flex flex-col gap-2 items-center justify-center mt-20'}>
        <div className={'font-playfair text-center text-2xl text-stone-700'}>Daily Inspiration</div>
        <div className={'text-stone-400'}>Moments of wisdom to brighten your day.</div>
      </header>
      <Masonry breakpointCols={{ default: 2 }} className="flex w-auto gap-3" columnClassName="">
        {quotes.map((quote: Quote) => (
          <QuoteCard quote={quote} key={quote.id} />
        ))}
      </Masonry>
      <AddQuoteModal refresh={refresh} />
    </div>
  );
};
