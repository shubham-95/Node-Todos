var bcrypt=require('bcryptjs');


//'$2a$08$G3EB45qHVnKL9dqR6pMfIumBvVHRh1homq/4rFcVcp7nBrottH0Tm'
//$2a$08$I34Fu.i7dkw2UO23.uA3CuBqlk3m0.nAd.cvNESFp0bKSPMHMIM6.
//var data =  bcrypt.hashSync('superadmin@oem_manoj_sharma_afcat',8);
//console.log(data);

if(bcrypt.compareSync('superadmin@oem_manoj_sharma_afcat','$2a$08$I34Fu.i7dkw2UO23.uA3CuBqlk3m0.nAd.cvNESFp0bKSPMHMIM6.')){
    console.log("Yes");
}
else{
    //superadmin@oem_manoj_sharma_afcat
    console.log('No');
}