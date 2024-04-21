from .ModuleFile import *


class ManagerSigninView(TokenObtainPairView):
    authentication_classes = [JWTAuthentication]
    
    def post(self, req):
        username = req.data.get('username')
        password = req.data.get('password')
        user = User.objects.get(username=username)

        # check who is logging in

        if not user.check_password(password):
                return Response({'error': 'Invalid credentials'}, status=401)
       
        if BandLeader.objects.filter(user__username=username).exists():
            # check if band leader is active
            if BandLeader.objects.filter(user__username=username, isactive=True).exists():
                account_type = 'bandleader'
            else:
                return Response({'error': 'Band leader\'s account is not active'})      
        elif BandMember.objects.filter(user__username=username).exists():
            # check if band member is active
            if BandMember.objects.filter(user__username=username, isactive=True).exists():
                account_type = 'bandmember'
            else:
                return Response({'error': 'Band member\'s account is not active'})
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        print(access_token)
        return Response({'token': access_token, 'account_type': account_type})

class ManagerSignupView(TokenObtainPairView):
    authentication_classes = [JWTAuthentication]

    def post(self, req):
        name = req.data.get('name')
        username = req.data.get('username')
        email = req.data.get('email')
        password = req.data.get('password')
        password2 = req.data.get('password2')
        account_type = req.data.get('account_type')

        if password == password2:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists.'})
            elif User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists.'})
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                if account_type == 'band_leader':
                    band_leader = BandLeader(user=user, name=name)
                    band_leader.save()
                elif account_type == 'band_member':
                    band_member = BandMember(user=user, name=name)
                    band_member.save()
                else:
                    return Response({'error': 'Invalid account type.'})
                return Response({'success': 'User created successfully.'})
        else:
            return Response({'error': 'Passwords do not match.'})

class ManagerLogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        logout(req)
        response = redirect('login')
        response.delete_cookie('token')
        return response
    
