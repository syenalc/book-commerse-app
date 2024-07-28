//購入履歴を保存するAPI作成を行う

import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request:Request,response:Response){
    const {sessionId}=await request.json();
    try{
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        //同じ商品の履歴があるのか見る
        const existingPurchase=await prisma.purchase.findFirst({
            where: {
                userId:session.client_reference_id!,
                bookId:session.metadata?.bookId!,
            }
        })

        if(!existingPurchase){
            const purchase = await prisma.purchase.create({
                data: {
                    userId: session.client_reference_id!,
                    bookId: session.metadata?.bookId!,
                }
            })
            return NextResponse.json({purchase});
        }else{
            return NextResponse.json({message: "既に購入済みです。"});
        }
    }catch(err:any){
        return NextResponse.json({message:err.message});
    }
}
