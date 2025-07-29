export type BadgeData = {
  logo?: string;
  logoUrl?: string;
  otherLogo?: string;
  logos?: string[];
  firstSelect?: string;
  secondSelect?: string;
  averageRating?: string;
  storeName?: string;
  text?: string;
  reviewText?: string;
  verifiedText?: string;
  openLink?: string;
  colorConfig?: BadgeColorConfig;
  htmlCode?: string;
  layout?: string;
};

export type BadgeColorConfig = {
  stars?: string;
  ratingNumber?: string;
  text?: string;
  background?: string;
  stroke?: string;
  storeName?: string;
  footerBackground?: string;
};
