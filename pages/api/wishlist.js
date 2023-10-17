import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { WishedProduct } from '@/models/WishedProduct';

export default async function handle(req, res) {
  try {
    await mongooseConnect();

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      console.error('User session is missing or invalid');
      res.status(401).json({ error: 'User session is missing or invalid' });
      return;
    }

    const user = session.user;

    console.log('User:', user); // Log user information

    if (req.method === 'POST') {
      const { product } = req.body;
      console.log('Received POST request with product:', product); // Log the product

      const wishedDoc = await WishedProduct.findOne({
        userEmail: user.email,
        product,
      });

      if (wishedDoc) {
        await WishedProduct.findByIdAndDelete(wishedDoc._id);
        console.log('Deleted wished product:', wishedDoc);
        res.json({ wishedDoc });
      } else {
        await WishedProduct.create({ userEmail: user.email, product });
        console.log('Created wished product');
        res.json('Created');
      }
    }

    if (req.method === 'GET') {
      const wishlistItems = await WishedProduct.find({
        userEmail: user.email,
      }).populate('product');

      console.log('Retrieved wishlist items:', wishlistItems); // Log the wishlist items

      res.json(wishlistItems);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
