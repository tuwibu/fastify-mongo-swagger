import { Schema, Document, model, Model } from 'mongoose';
import { Article, IArticleDocument } from './Article.model';
import { numberFormat } from '../utils';

export interface IWebsite {
  domain: string,
  selectors: {
    type: 'menu' | 'post',
    selector: string,
    priority: number,
  }[],
  priority: number,
  note?: string,
  active: boolean,
  createdAt: Date,
  updatedAt: Date,
  Articles: IArticleDocument[]
}

export interface IWebsiteDocument extends Document, IWebsite {

}

interface IWebsiteModel extends Model<IWebsiteDocument> {

}

const schema = new Schema<IWebsite>({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  selectors: [{
    type: Object,
  }],
  priority: {
    type: Number,
    default: 1,
    min: 1,
  },
  note: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
    index: true
  },
  Articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }]
}, {
  timestamps: true,
  versionKey: false
});

schema.pre(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const count = await Article.countDocuments({ Group: doc._id });
    if (count > 0) {
      next(new Error(`Website has ${numberFormat(count)} articles, cannot delete this website`));
    } else {
      next();
    }
  } else {
    next(new Error('Website not found'));
  }
})

export const Website = model<IWebsite, IWebsiteModel>('Website', schema);

export default Website;