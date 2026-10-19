import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import {
  Film,
  Play,
  Pause,
  Tv,
  Star,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  Bookmark,
  Calendar,
  Languages,
} from 'lucide-react';

interface DramaItem {
  id: string;
  title: string;
  category: 'kdrama_cdrama' | 'tv3_melayu' | 'movie_melayu';
  categoryLabel: string;
  year: string;
  rating: number;
  episodes: string;
  audioLanguage: 'Dubbing Melayu' | 'Dubbing Indonesia' | 'Bahasa Melayu Asal';
  synopsis: string;
  poster: string;
  trailerBg: string;
  cast: string[];
  director?: string;
  tags: string[];
}

const DRAMA_CATALOG: DramaItem[] = [
  // ==========================================
  // SECTION 1: 10 DRAMA KOREA & CHINA DUBBING
  // ==========================================
  {
    id: 'kd_1',
    title: 'Crash Landing on You',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Melayu',
    year: '2020',
    rating: 9.8,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Pewaris konglomerat Korea Selatan terhempas semasa paragliding di zon sempadan Korea Utara dan diselamatkan oleh seorang pegawai tentera berhati mulia.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-pink-950 via-slate-900 to-indigo-950',
    cast: ['Hyun Bin', 'Son Ye-jin', 'Seo Ji-hye', 'Kim Jung-hyun'],
    director: 'Lee Jung-hyo',
    tags: ['Romantik', 'Komedi', 'Tentera', 'Top Rated'],
  },
  {
    id: 'kd_2',
    title: 'Descendants of the Sun',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Melayu',
    year: '2016',
    rating: 9.7,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Kisah cinta agung antara kapten pasukan khas tentera dan seorang doktor bedah yang dihantar ke kawasan bencana dan konflik antarabangsa.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-amber-950 via-slate-900 to-blue-950',
    cast: ['Song Joong-ki', 'Song Hye-kyo', 'Jin Goo', 'Kim Ji-won'],
    director: 'Lee Eung-bok',
    tags: ['Aksi', 'Perubatan', 'Romantik', 'Blockbuster'],
  },
  {
    id: 'kd_3',
    title: 'Goblin: The Lonely and Great God',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Melayu',
    year: '2016',
    rating: 9.8,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Seorang pahlawan purba dikutuk dengan kehidupan abadi sebagai Goblin dan perlu mencari pengantin manusianya untuk menamatkan sumpahan.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-purple-950 via-slate-900 to-indigo-950',
    cast: ['Gong Yoo', 'Kim Go-eun', 'Lee Dong-wook', 'Yoo In-na'],
    director: 'Lee Eung-bok',
    tags: ['Fantasi', 'Romantik', 'Mitos', 'Klasik'],
  },
  {
    id: 'kd_4',
    title: 'Queen of Tears',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Melayu',
    year: '2024',
    rating: 9.6,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Kisah pasangan suami isteri berprofil tinggi yang mengalami krisis perkahwinan namun menemui semula cinta mereka dalam keadaan yang tidak disangka.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-rose-950 via-slate-900 to-slate-950',
    cast: ['Kim Soo-hyun', 'Kim Ji-won', 'Park Sung-hoon'],
    director: 'Jang Young-woo',
    tags: ['Drama', 'Romantik', 'Keluarga', 'Trending 2024'],
  },
  {
    id: 'kd_5',
    title: 'The Glory',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Indo',
    year: '2023',
    rating: 9.7,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Dubbing Indonesia',
    synopsis: 'Bekas mangsa buli sekolah merancang strategi balas dendam yang teliti dan menuntut keadilan terhadap pembulinya selepas bertahun-tahun bersabar.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-zinc-950 via-slate-900 to-neutral-950',
    cast: ['Song Hye-kyo', 'Lee Do-hyun', 'Lim Ji-yeon'],
    director: 'Ahn Gil-ho',
    tags: ['Thriller', 'Balas Dendam', 'Psikologi'],
  },
  {
    id: 'kd_6',
    title: 'Squid Game',
    category: 'kdrama_cdrama',
    categoryLabel: 'K-Drama Dub Melayu',
    year: '2021',
    rating: 9.6,
    episodes: '9 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Ratusan peserta yang terdesak wang menyertai siri permainan kanak-kanak tradisional dengan taruhan nyawa demi memenangi hadiah berbilion won.',
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-teal-950 via-pink-950 to-slate-950',
    cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-joon', 'Jung Ho-yeon'],
    director: 'Hwang Dong-hyuk',
    tags: ['Survival', 'Aksi', 'Misteri', 'Global Hit'],
  },
  {
    id: 'cd_7',
    title: 'Hidden Love (Cinta Tersembunyi)',
    category: 'kdrama_cdrama',
    categoryLabel: 'C-Drama Dub Melayu',
    year: '2023',
    rating: 9.8,
    episodes: '25 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Sang Zhi jatuh cinta secara rahsia dengan rakan abangnya, Duan Jiaxu, sejak zaman remaja sehingga mereka bertemu semula di universiti.',
    poster: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-fuchsia-950 via-slate-900 to-pink-950',
    cast: ['Zhao Lusi', 'Chen Zheyuan', 'Victor Ma'],
    director: 'Lee Ching-jung',
    tags: ['Romantik Moden', 'Remaja', 'Sweet Romance'],
  },
  {
    id: 'cd_8',
    title: 'Love Between Fairy and Devil',
    category: 'kdrama_cdrama',
    categoryLabel: 'C-Drama Dub Indo',
    year: '2022',
    rating: 9.7,
    episodes: '36 Episod Penuh',
    audioLanguage: 'Dubbing Indonesia',
    synopsis: 'Raja Syaitan Dongfang Qingcang secara tidak sengaja bertukar jiwa dan terikat nasib dengan pari-pari bunga Orkid yang naif.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-violet-950 via-indigo-950 to-slate-950',
    cast: ['Dylan Wang', 'Esther Yu', 'Zhang Linghe'],
    director: 'Yi Zheng',
    tags: ['Xianxia', 'Fantasi Purba', 'Magik', 'Romantik'],
  },
  {
    id: 'cd_9',
    title: 'Till The End of The Moon',
    category: 'kdrama_cdrama',
    categoryLabel: 'C-Drama Dub Melayu',
    year: '2023',
    rating: 9.6,
    episodes: '40 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Seorang dewi dihantar kembali 500 tahun ke masa lalu untuk menghalang seorang putera tebusan daripada menjadi Raja Iblis yang memusnahkan alam semesta.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-amber-950 to-slate-950',
    cast: ['Luo Yunxi', 'Bai Lu', 'Chen Duling', 'Deng Wei'],
    director: 'Kuk Kok-leung',
    tags: ['Xianxia', 'Aksi Pedang', 'Epik Fantasi'],
  },
  {
    id: 'cd_10',
    title: 'Who Rules The World',
    category: 'kdrama_cdrama',
    categoryLabel: 'C-Drama Dub Melayu',
    year: '2022',
    rating: 9.5,
    episodes: '40 Episod Penuh',
    audioLanguage: 'Dubbing Melayu',
    synopsis: 'Dua pahlawan seni bela diri terunggul menyembunyikan identiti bangsawan mereka sambil bersaing dan akhirnya bersatu menentang kekacauan empayar.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-blue-950 via-cyan-950 to-slate-950',
    cast: ['Yang Yang', 'Zhao Lusi', 'Zhang Fengyi'],
    director: 'Yin Tao',
    tags: ['Wuxia', 'Seni Mempertahankan Diri', 'Perebutan Kuasa'],
  },

  // ==========================================
  // SECTION 2: 10 DRAMA MELAYU TERBAIK TV3
  // ==========================================
  {
    id: 'tv3_1',
    title: 'Nur & Nur 2',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Samarinda',
    year: '2018-2019',
    rating: 9.9,
    episodes: '34 Episod (Musim 1 & 2)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Fenomena drama Malaysia mengisahkan cinta Ustaz Adam dan Nur, seorang wanita lorong yang mencari cahaya hidayah di sebalik prasangka masyarakat.',
    poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-emerald-950 via-slate-900 to-teal-950',
    cast: ['Syafiq Kyle', 'Amyra Rosli', 'Azhan Rani', 'Noorkhiriah'],
    director: 'Shahrulezad Mohameddin',
    tags: ['Fenomena TV3', 'Keagamaan', 'Pengajaran', 'Anugerah DFKL'],
  },
  {
    id: 'tv3_2',
    title: '7 Hari Mencintaiku (Musim 1-3)',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Akasia',
    year: '2016-2022',
    rating: 9.8,
    episodes: '83 Episod Lengkap',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Kisah perkahwinan Khuzairi dan Mia Adriana yang penuh dengan cabaran ego, kasih sayang mertua, dan kesabaran seorang lelaki membimbing isteri.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-slate-900 to-amber-950',
    cast: ['Shukri Yahaya', 'Siti Saleha', 'Liza Abdullah', 'Kazar Saisi'],
    director: 'Jamal Khan',
    tags: ['Slot Akasia', 'Kekeluargaan', 'Drama Air Mata', 'Mak Leha'],
  },
  {
    id: 'tv3_3',
    title: 'Melur Untuk Firdaus',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Lestary',
    year: '2022',
    rating: 9.7,
    episodes: '28 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Firdaus dipaksa berkahwin dengan Melur pilihan keluarga, namun kesabaran dan kelembutan Melur perlahan-lahan mencairkan hati Firdaus yang keras.',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-pink-950 via-purple-950 to-slate-950',
    cast: ['Meerqeen', 'Anna Jobling', 'Fimie Don', 'Nesa Idrus'],
    director: 'Zamri Zakaria',
    tags: ['Trending Serantau', 'Romantik', 'Lestary TV3'],
  },
  {
    id: 'tv3_4',
    title: 'Leftenan Zana',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Lestary',
    year: '2019',
    rating: 9.6,
    episodes: '16 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Zana gigih membuktikan kemampuannya sebagai wanita untuk bergelar pegawai tentera darat Angkatan Tentera Malaysia walaupun dihalang ayahnya.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-green-950 via-stone-900 to-slate-950',
    cast: ['Janna Nick', 'Sheila Rusly', 'Tunku Hanis', 'Redza Rosli'],
    director: 'Azman Yahya (Jinggo)',
    tags: ['Tentera', 'Patriotik', 'Inspirasi Wanita'],
  },
  {
    id: 'tv3_5',
    title: 'Risik Pada Hati',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Akasia',
    year: '2022',
    rating: 9.7,
    episodes: '28 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Pengorbanan Hayfa yang membenarkan suaminya berkahwin lain kerana tidak mampu memberikan zuriat, namun membawa derita emosi yang mendalam.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-rose-950 via-slate-900 to-slate-950',
    cast: ['Alif Satar', 'Ummi Nazeera', 'Zara Zya'],
    director: 'Pala (Faizal Nadxaman)',
    tags: ['Air Mata', 'Keluarga', 'Poligami', 'Lakonan Hebat'],
  },
  {
    id: 'tv3_6',
    title: 'Kampung People (Musim 1-3)',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Lestary',
    year: '2019-2022',
    rating: 9.8,
    episodes: '38 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Keluarga Razif terpaksa menyamar sebagai orang kampung miskin di bawah program perlindungan saksi dengan pelbagai gelagat komedi kelakar.',
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-amber-950 via-green-950 to-slate-950',
    cast: ['Rashidi Ishak', 'Elly Mazlein', 'Riena Diana', 'Hun Haqeem'],
    director: 'Wan Hasliza Wan Zainuddin',
    tags: ['Komedi Pecah Perut', 'Keluarga', 'Laila & Jekfer'],
  },
  {
    id: 'tv3_7',
    title: 'Takdir Yang Tertulis',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Samarinda',
    year: '2021',
    rating: 9.8,
    episodes: '28 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Konflik hak penjagaan anak dan kecurangan rumahtangga yang membongkar rahsia hitam antara sahabat baik dan suami tersayang.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-indigo-950 via-slate-900 to-slate-950',
    cast: ['Nazim Othman', 'Nad Zainal', 'Elvina Mohamad', 'Alvin Chong'],
    director: 'Shahrulezad Mohameddin',
    tags: ['Plot Twist Padu', 'Samarinda TV3', 'Dendam'],
  },
  {
    id: 'tv3_8',
    title: 'Andai Itu Takdirnya',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Akasia',
    year: '2023',
    rating: 9.6,
    episodes: '64 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Kisah ketabahan Aleya mengharungi penghinaan dan fitnah daripada Syed Aizril yang ego sebelum penyesalan mengubah segalanya.',
    poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-slate-900 to-slate-950',
    cast: ['Shukri Yahaya', 'Hannah Delisha', 'Puteri Sarah Liyana'],
    director: 'Jamal Khan',
    tags: ['Novel Adaptasi', 'Akasia TV3', 'Emosi Mendalam'],
  },
  {
    id: 'tv3_9',
    title: 'Cinta Si Wedding Planner',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Akasia',
    year: '2015',
    rating: 9.5,
    episodes: '28 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Zara perancang perkahwinan bertemu dengan Farhan pegawai tentera laut, membawa kepada kisah percintaan yang penuh dugaan dan kesetiaan.',
    poster: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-blue-950 via-slate-900 to-indigo-950',
    cast: ['Sharnaaz Ahmad', 'Mira Filzah', 'Fadlan Hazim'],
    director: 'Along Kamaludin',
    tags: ['Tentera Laut', 'Romantik Manis', 'Akasia Klasik'],
  },
  {
    id: 'tv3_10',
    title: 'Kerana Dia Manusia Biasa',
    category: 'tv3_melayu',
    categoryLabel: 'TV3 Samarinda',
    year: '2019',
    rating: 9.5,
    episodes: '28 Episod Penuh',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Tengku Shamil berdepan ujian apabila isterinya diuji dengan penyakit mental dan rahsia masa lalu yang menguji ikatan perkahwinan mereka.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-teal-950 via-slate-900 to-slate-950',
    cast: ['Shukri Yahaya', 'Emma Maembong', 'Husna Mustaffa'],
    director: 'Idora Abdul Rahman',
    tags: ['Kesihatan Mental', 'Samarinda TV3', 'Kasih Sayang'],
  },

  // ==========================================
  // SECTION 3: 10 MOVIE MELAYU PALING IKONIK
  // ==========================================
  {
    id: 'mov_1',
    title: 'Munafik 1',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2016',
    rating: 9.8,
    episodes: 'Filem Penuh (1 Jam 45 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Ustaz Adam yang trauma selepas kematian isterinya diminta merawat Maria yang diganggu makhluk halus, membongkar rahsia ghaib yang menggoncang keimanannya.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-black to-slate-950',
    cast: ['Syamsul Yusof', 'Nabila Huda', 'Fizz Fairuz', 'Pekad Maembong'],
    director: 'Syamsul Yusof',
    tags: ['Seram Islamik', 'Blokbuster RM 19 Juta', 'Festival Filem Malaysia'],
  },
  {
    id: 'mov_2',
    title: 'Munafik 2',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2018',
    rating: 9.9,
    episodes: 'Filem Penuh (1 Jam 50 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Ustaz Adam berdepan dengan Abuja, seorang pemimpin ajaran sesat yang mengganas dan menyesatkan penduduk kampung dengan sihir jahat.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-black to-stone-950',
    cast: ['Syamsul Yusof', 'Maya Karin', 'Nasir Bilal Khan', 'Mawi'],
    director: 'Syamsul Yusof',
    tags: ['Rekod RM 48 Juta', 'Seram Epik', 'Abuja Ajaran Sesat'],
  },
  {
    id: 'mov_3',
    title: 'Sheriff: Narko Integriti',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2024',
    rating: 9.8,
    episodes: 'Filem Penuh (2 Jam 12 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Sheriff, pegawai polis Jabatan Integriti ditugaskan membongkar pembunuh bersiri bergelar Meth Killer di kalangan pegawai Jabatan Narkotik sendiri.',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-blue-950 via-slate-950 to-red-950',
    cast: ['Zul Ariffin', 'Syafiq Kyle', 'Dato Aaron Aziz', 'Elizabeth Tan'],
    director: 'Syafiq Yusof',
    tags: ['Aksi Kepolisan', 'Rekod RM 64 Juta', 'Meth Killer', 'Plot Twist'],
  },
  {
    id: 'mov_4',
    title: 'Abang Long Fadil 3',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2022',
    rating: 9.6,
    episodes: 'Filem Penuh (1 Jam 55 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Fadil menyertai agensi perisik khas NSP untuk menumpaskan sindiket penjenayah antarabangsa Chow Han dengan pelbagai aksi gajet canggih yang lucu.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-amber-950 via-slate-950 to-orange-950',
    cast: ['Zizan Razak', 'Johan', 'Maya Karin', 'Farid Kamil', 'Elizabeth Tan'],
    director: 'Syafiq Yusof',
    tags: ['Aksi Komedi', 'Blokbuster RM 25 Juta', 'Perisik NSP'],
  },
  {
    id: 'mov_5',
    title: 'Adnan Sempit 3',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2013',
    rating: 9.5,
    episodes: 'Filem Penuh (1 Jam 38 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Adnan dan Nadia berdepan fasa rumahtangga baru selepas melahirkan anak, disulami persaingan komedi bersama Bobby dan Wawa.',
    poster: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-orange-950 via-slate-900 to-amber-950',
    cast: ['Shaheizy Sam', 'Intan Ladyana', 'Along Cham', 'Yana Samsudin'],
    director: 'Ismail Bob Hasim',
    tags: ['Komedi Rempit', 'Francais Box Office', 'Adnan & Nadia'],
  },
  {
    id: 'mov_6',
    title: 'Bini-Biniku Gangster',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2011',
    rating: 9.5,
    episodes: 'Filem Penuh (1 Jam 40 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Herry tidak mengetahui bahawa isterinya Manja merupakan ketua gengster gerun di bandar, membawa kepada pelbagai salah faham melucukan.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-rose-950 via-slate-950 to-slate-900',
    cast: ['Yana Samsudin', 'Shaheizy Sam', 'Intan Ladyana', 'Zul Handy Black'],
    director: 'Ismail Bob Hasim',
    tags: ['Aksi Komedi', 'Gengster Wanita', 'Blokbuster'],
  },
  {
    id: 'mov_7',
    title: 'Duyung',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2008',
    rating: 9.6,
    episodes: 'Filem Penuh (1 Jam 45 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Jimmy seorang pemuda pencinta alam yang dipulaukan penduduk kampung menyelamatkan seorang Duyung cantik yang terdampar di pulau.',
    poster: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-cyan-950 via-blue-950 to-slate-950',
    cast: ['Saiful Apek', 'Maya Karin', 'Yasmin Hani', 'Yassin Yahya'],
    director: 'Prof Madya A. Razak Mohaideen',
    tags: ['Komedi Lautan', 'Lagenda Duyung', 'Maya Karin'],
  },
  {
    id: 'mov_8',
    title: 'Hikayat Merong Mahawangsa',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2011',
    rating: 9.7,
    episodes: 'Filem Penuh (1 Jam 52 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Epik sejarah purba Tanah Melayu menceritakan Merong Mahawangsa yang diamanahkan mengiringi Putera Rom mengahwini Puteri China di bawah ancaman Geroda.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-amber-950 via-stone-900 to-slate-950',
    cast: ['Stephen Rahman-Hughes', 'Gavin Stenhouse', 'Dato Rahim Razali', 'Jing Lusi'],
    director: 'Yusry Abdul Halim',
    tags: ['Epik Sejarah', 'Visual Bertaraf Antarabangsa', 'KRU Studios'],
  },
  {
    id: 'mov_9',
    title: 'Langgar',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2013',
    rating: 9.6,
    episodes: 'Filem Penuh (1 Jam 35 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Nizam menyusup masuk ke dalam sindiket kongsi gelap untuk membalas dendam terhadap pembunuh isteri dan anaknya yang sarat mengandung.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-neutral-950 via-red-950 to-slate-950',
    cast: ['Adi Putra', 'Namron', 'Zul Huzaimy', 'Hans Isaac', 'Natasha Hudson'],
    director: 'Sein Ruffedge',
    tags: ['Aksi Jenayah Gelap', 'Balas Dendam', 'Kultus Klasik'],
  },
  {
    id: 'mov_10',
    title: 'KL Gangster & Kongsi',
    category: 'movie_melayu',
    categoryLabel: 'Filem Blokbuster Melayu',
    year: '2011',
    rating: 9.8,
    episodes: 'Filem Penuh (1 Jam 45 Minit)',
    audioLanguage: 'Bahasa Melayu Asal',
    synopsis: 'Malek cuba meninggalkan dunia samseng selepas bebas dari penjara, namun Shark anak tiri King mencetuskan perang wilayah kongsi gelap yang berdarah.',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    trailerBg: 'from-red-950 via-slate-950 to-black',
    cast: ['Dato Aaron Aziz', 'Adi Putra', 'Syamsul Yusof', 'Sofi Jikan', 'Farid Kamil'],
    director: 'Syamsul Yusof',
    tags: ['Aksi Gangster Malaysia', 'Kutipan RM 12 Juta', 'Shark & Malek'],
  },
];

export const DramaMovieView: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'kdrama_cdrama' | 'tv3_melayu' | 'movie_melayu'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrama, setSelectedDrama] = useState<DramaItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedAudio, setSelectedAudio] = useState<'melayu' | 'indonesia' | 'asal'>('melayu');
  const [selectedSub, setSelectedSub] = useState<'bm' | 'en' | 'off'>('bm');
  const [videoProgress, setVideoProgress] = useState(35);

  const filteredItems = DRAMA_CATALOG.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleOpenPlayer = (item: DramaItem) => {
    sounds.playClick();
    setSelectedDrama(item);
    setSelectedEpisode(1);
    setIsPlayingVideo(true);
    setVideoProgress(15);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Panggung Drama & Filem Rasmi
              </span>
              <span className="text-xs text-amber-300 font-bold hidden sm:inline">
                ★ 100% Kualiti HD & Dubbing Melayu
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              Koleksi Drama Korea/China, TV3 & Filem Blokbuster Melayu
            </h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari drama, pelakon, tajuk filem..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold p-1 bg-slate-950 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('all');
          }}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeCategory === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Semua Koleksi (30 Tajuk)
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('kdrama_cdrama');
          }}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'kdrama_cdrama'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>10 Drama Korea & China (Dub Melayu/Indo)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('tv3_melayu');
          }}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'tv3_melayu'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📺 10 Drama Melayu Terbaik TV3</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveCategory('movie_melayu');
          }}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'movie_melayu'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🎬 10 Movie Melayu Paling Ikonik</span>
        </button>
      </div>

      {/* Grid of Posters / Dramas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenPlayer(item)}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/60 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer flex flex-col"
          >
            {/* Poster Thumbnail */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

              {/* Rating Pill */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/30 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{item.rating}</span>
              </div>

              {/* Audio Dubbing Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-blue-600/90 text-white font-black text-[9px] uppercase tracking-wider shadow-md">
                  {item.audioLanguage}
                </span>
              </div>

              {/* Play Hover Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Episodes indicator */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300">
                <span className="font-bold text-white">{item.year}</span>
                <span className="bg-black/60 px-2 py-0.5 rounded-md font-mono">{item.episodes}</span>
              </div>
            </div>

            {/* Title & Synopsis Info */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="font-black text-sm text-white group-hover:text-purple-300 transition truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.synopsis}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN CINEMATIC MEDIA PLAYER MODAL */}
      {selectedDrama && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="w-full max-w-5xl bg-slate-900 border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Top Bar */}
            <div className="p-3.5 px-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-400" />
                <span className="font-extrabold truncate">{selectedDrama.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-400/30 font-bold">
                  {selectedDrama.audioLanguage}
                </span>
              </div>
              <button
                onClick={() => setSelectedDrama(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedDrama.poster}
                alt={selectedDrama.title}
                className="w-full h-full object-cover opacity-50 blur-xs"
              />

              {/* Player Overlay Graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono bg-black/60 px-3 py-1 rounded-xl border border-white/10">
                    Episod {selectedEpisode} • 1080p Ultra HD
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {selectedDrama.rating}
                    </span>
                  </div>
                </div>

                {/* Center Play Button */}
                <div className="self-center text-center space-y-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsPlayingVideo(!isPlayingVideo);
                    }}
                    className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-110 mx-auto"
                  >
                    {isPlayingVideo ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                  </button>
                  <p className="text-xs text-slate-300 font-medium">
                    {isPlayingVideo ? 'Memainkan Siaran HD...' : 'Jeda Video'}
                  </p>
                </div>

                {/* Video Controls Bar */}
                <div className="space-y-2">
                  {/* Scrubber Progress Bar */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setVideoProgress(Math.round(clickPos * 100));
                    }}
                    className="w-full h-2 rounded-full bg-slate-700/80 cursor-pointer overflow-hidden relative"
                  >
                    <div
                      style={{ width: `${videoProgress}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px]">
                        {Math.floor(videoProgress * 0.45)}:20 / 45:00
                      </span>
                      <button
                        onClick={() => setSelectedAudio(selectedAudio === 'melayu' ? 'indonesia' : 'melayu')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-700"
                      >
                        <Languages className="w-3 h-3 text-purple-400" />
                        <span>Audio: {selectedAudio.toUpperCase()}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSub(selectedSub === 'bm' ? 'off' : 'bm')}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-white"
                      >
                        Sari Kata: {selectedSub.toUpperCase()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Meta & Episodes List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xl font-black text-white">{selectedDrama.title}</h3>
                  <p className="text-slate-400 mt-1">{selectedDrama.synopsis}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      sounds.playCoinChime();
                      alert('Episod dimuat turun untuk tontonan luar talian (PWA).');
                    }}
                    className="btn-3d btn-3d-subtle px-3 py-2 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Download HD</span>
                  </button>
                </div>
              </div>

              {/* Cast List */}
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <strong className="text-white">Pelakon Utama:</strong>
                <span>{selectedDrama.cast.join(', ')}</span>
              </div>

              {/* Episodes Selector Pills */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Pilih Episod / Bahagian:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((ep) => (
                    <button
                      key={ep}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEpisode(ep);
                        setVideoProgress(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                        selectedEpisode === ep
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Episod {ep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
