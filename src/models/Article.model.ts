import { Schema, Document, model, Model } from 'mongoose';
import { Website, IWebsiteDocument } from './Website.model';

export interface IArticle {
  title: string,
  url: string,
  keywords: string[],
  priority: number,
  viewed: number,
  type: 'post' | 'video',
  active: boolean,
  createdAt: Date,
  updatedAt: Date,
  Website: IWebsiteDocument
}

export interface IArticleDocument extends Document, IArticle {

}

interface IArticleModel extends Model<IArticleDocument> {

}

const schema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  keywords: [{
    type: String,
  }],
  priority: {
    type: Number,
    default: 1,
    min: 1,
  },
  viewed: {
    type: Number,
    default: 0,
    min: 0,
  },
  type: {
    type: String,
    enum: ['post', 'video'],
    default: 'post',
  },
  active: {
    type: Boolean,
    default: false,
    index: true
  },
  Website: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

schema.pre('save', async function (next) {
  await Website.findByIdAndUpdate(this.Website, {
    $addToSet: {
      Articles: this._id
    }
  });
  next();
})

schema.pre(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await Website.findByIdAndUpdate(doc.Website, {
      $pull: {
        Articles: doc._id
      }
    });
    next();
  } else {
    next(new Error('Article not found'));
  }
})

export const Article = model<IArticle, IArticleModel>('Article', schema);

export default Article;