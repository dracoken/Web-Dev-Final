import prisma from "@/lib/prisma";

export default async function handler(req,res)
{
    console.log("in login api");
    if(req.method != "GET")
    {
        res.status(400).json({error:"method not allowed"});
        return;
    }

    const login = req.prams;//might have to use query instead
    if(login.id <= 0)
    {
        res.status(400).json({error:"id needs to be greater than 0"});
        return;
    }
    let account;
    try
    {
        account = prisma.User.findUnique({
            where:
            {
                AND: {
                    userName:login.userName,
                    password:login.password,
                }
            }
        });

        if(account == null)
        {
            res.status(402).json({error:"wrong password, login or dosen't exist in db"});
            return;
        }
        res.status(200).json(account);
    }
    catch(error)
    {
        res.status(401).json({error:"problem with finding account"});
    }
}