import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  templateData: { type: mongoose.Schema.Types.Mixed, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Template', templateSchema);
