export interface TrendingPost {
  id: number;
  image: string;
  phrase: string;
  likes: number;
  user: {
    username: string;
    avatar: string;
  };
}

export const trendingPosts: TrendingPost[] = [
  {
    id: 1,
    image:
      'https://readdy.ai/api/search-image?query=serene%20mountain%20landscape%20at%20golden%20hour%2C%20misty%20peaks%2C%20warm%20sunlight%2C%20peaceful%20nature%20scene%2C%20dreamy%20atmosphere%2C%20cinematic%20composition&width=200&height=350&seq=trending1&orientation=portrait',
    phrase: 'Find peace in the mountains',
    likes: 1247,
    user: {
      username: 'sophia_lens',
      avatar:
        'https://readdy.ai/api/search-image?query=beautiful%20portrait%20of%20a%20young%20woman%20photographer%2C%20professional%20headshot%2C%20warm%20lighting%2C%20creative%20artist%2C%20gentle%20smile%2C%20natural%20beauty&width=40&height=40&seq=trenduser1&orientation=squarish',
    },
  },
  {
    id: 2,
    image:
      'https://readdy.ai/api/search-image?query=cozy%20coffee%20shop%20interior%2C%20warm%20lighting%2C%20steam%20rising%20from%20coffee%20cup%2C%20wooden%20tables%2C%20ambient%20atmosphere%2C%20inviting%20space&width=200&height=350&seq=trending2&orientation=portrait',
    phrase: 'Morning rituals',
    likes: 892,
    user: {
      username: 'marco_vision',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20man%20with%20camera%2C%20creative%20photographer%2C%20warm%20lighting%2C%20artistic%20soul%2C%20friendly%20smile%2C%20professional%20headshot&width=40&height=40&seq=trenduser2&orientation=squarish',
    },
  },
  {
    id: 3,
    image:
      'https://readdy.ai/api/search-image?query=beautiful%20flower%20field%20at%20sunset%2C%20wildflowers%20swaying%20in%20breeze%2C%20golden%20hour%20lighting%2C%20dreamy%20bokeh%2C%20romantic%20atmosphere&width=200&height=350&seq=trending3&orientation=portrait',
    phrase: 'Chasing golden hours',
    likes: 1653,
    user: {
      username: 'luna_creates',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20creative%20young%20woman%2C%20artistic%20expression%2C%20soft%20lighting%2C%20bohemian%20style%2C%20natural%20beauty%2C%20gentle%20eyes&width=40&height=40&seq=trenduser3&orientation=squarish',
    },
  },
  {
    id: 4,
    image:
      'https://readdy.ai/api/search-image?query=peaceful%20ocean%20waves%20at%20sunset%2C%20golden%20reflection%20on%20water%2C%20serene%20seascape%2C%20dreamy%20atmosphere%2C%20warm%20colors%2C%20tranquil%20mood&width=200&height=350&seq=trending4&orientation=portrait',
    phrase: 'Ocean whispers',
    likes: 567,
    user: {
      username: 'alex_captures',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20photographer%2C%20creative%20professional%2C%20warm%20lighting%2C%20friendly%20smile%2C%20natural%20beauty&width=40&height=40&seq=trenduser4&orientation=squarish',
    },
  },
  {
    id: 5,
    image:
      'https://readdy.ai/api/search-image?query=misty%20forest%20path%20in%20early%20morning%2C%20soft%20light%20filtering%20through%20trees%2C%20peaceful%20woodland%20scene%2C%20mystical%20atmosphere%2C%20nature%20tranquility&width=200&height=350&seq=trending5&orientation=portrait',
    phrase: 'Walk your own path',
    likes: 789,
    user: {
      username: 'emma_grace',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20woman%20with%20gentle%20smile%2C%20natural%20lighting%2C%20soft%20expression%2C%20warm%20eyes%2C%20peaceful%20face%2C%20professional%20headshot&width=40&height=40&seq=trenduser5&orientation=squarish',
    },
  },
  {
    id: 6,
    image:
      'https://readdy.ai/api/search-image?query=beautiful%20cherry%20blossom%20tree%20in%20spring%2C%20soft%20pink%20petals%20falling%2C%20peaceful%20garden%20scene%2C%20renewal%20and%20hope%2C%20natural%20beauty&width=200&height=350&seq=trending6&orientation=portrait',
    phrase: 'Spring whispers hope',
    likes: 1234,
    user: {
      username: 'david_art',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20creative%20professional%2C%20artistic%20photographer%2C%20warm%20lighting%2C%20friendly%20expression%2C%20natural%20beauty&width=40&height=40&seq=trenduser6&orientation=squarish',
    },
  },
  {
    id: 7,
    image:
      'https://readdy.ai/api/search-image?query=cozy%20reading%20nook%20with%20books%20and%20warm%20lamp%20light%2C%20comfortable%20armchair%2C%20peaceful%20home%20corner%2C%20soft%20textures%2C%20inviting%20atmosphere&width=200&height=350&seq=trending7&orientation=portrait',
    phrase: 'Stories heal the soul',
    likes: 445,
    user: {
      username: 'sophia_lens',
      avatar:
        'https://readdy.ai/api/search-image?query=beautiful%20portrait%20of%20a%20young%20woman%20photographer%2C%20professional%20headshot%2C%20warm%20lighting%2C%20creative%20artist%2C%20gentle%20smile%2C%20natural%20beauty&width=40&height=40&seq=trenduser7&orientation=squarish',
    },
  },
  {
    id: 8,
    image:
      'https://readdy.ai/api/search-image?query=gentle%20rain%20drops%20on%20window%20glass%2C%20soft%20focus%20background%2C%20peaceful%20rainy%20day%2C%20cozy%20indoor%20atmosphere%2C%20contemplative%20mood&width=200&height=350&seq=trending8&orientation=portrait',
    phrase: 'Let rain wash worries away',
    likes: 678,
    user: {
      username: 'marco_vision',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20man%20with%20camera%2C%20creative%20photographer%2C%20warm%20lighting%2C%20artistic%20soul%2C%20friendly%20smile%2C%20professional%20headshot&width=40&height=40&seq=trenduser8&orientation=squarish',
    },
  },
  {
    id: 9,
    image:
      'https://readdy.ai/api/search-image?query=peaceful%20mountain%20lake%20reflection%2C%20calm%20water%20surface%2C%20serene%20landscape%2C%20golden%20hour%20lighting%2C%20tranquil%20atmosphere%2C%20nature%20beauty&width=200&height=350&seq=trending9&orientation=portrait',
    phrase: 'Reflect on beauty',
    likes: 892,
    user: {
      username: 'luna_creates',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20creative%20young%20woman%2C%20artistic%20expression%2C%20soft%20lighting%2C%20bohemian%20style%2C%20natural%20beauty%2C%20gentle%20eyes&width=40&height=40&seq=trenduser9&orientation=squarish',
    },
  },
  {
    id: 10,
    image:
      'https://readdy.ai/api/search-image?query=warm%20candlelight%20in%20dark%20room%2C%20soft%20glowing%20flame%2C%20peaceful%20evening%20atmosphere%2C%20cozy%20meditation%20space%2C%20calming%20ambiance&width=200&height=350&seq=trending10&orientation=portrait',
    phrase: 'Light guides the way',
    likes: 1156,
    user: {
      username: 'alex_captures',
      avatar:
        'https://readdy.ai/api/search-image?query=portrait%20of%20a%20young%20photographer%2C%20creative%20professional%2C%20warm%20lighting%2C%20friendly%20smile%2C%20natural%20beauty&width=40&height=40&seq=trenduser10&orientation=squarish',
    },
  },
];
