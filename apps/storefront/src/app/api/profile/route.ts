import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const user = await prisma.user.findUniqueOrThrow({
         where: { id: userId, isEmailVerified: true },
         include: {
            cart: {
               include: {
                  items: {
                     include: {
                        product: true,
                     },
                  },
               },
            },
            addresses: true,
            wishlist: true,
         },
      })

      return NextResponse.json({
         phone: user.phone,
         email: user.email,
         name: user.name,
         birthday: user.birthday,
         addresses: user.addresses,
         wishlist: user.wishlist,
         cart: user.cart,
      })
   } catch (error) {
      console.error('[PROFILE_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}


export async function PATCH(
   req: Request
) {
   try {
     

      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const {
         data: { name, phone,email },
      } = await req.json()

      // TODO? maybe add email isNotVerified when user changes the email??
      const user = await prisma.user.update({
         where: {
            id: userId,
         },
         data: {
           name,
           phone,
           email
            
         },
      })

      return NextResponse.json(user)
   } catch (error) {
      console.error('[PROFILE_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

